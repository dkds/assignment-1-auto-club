import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { MemoizedSelector, DefaultProjectorFn } from "@ngrx/store";
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NGXLogger } from "ngx-logger";
import { CarMake } from "src/app/core/model/car-make.model";
import { CarModel } from "src/app/core/model/car-model.model";
import { listCarMakes } from "src/app/core/state/car-make/car-make.selectors";
import { remove, save } from "src/app/core/state/car-model/car-model.actions";
import { listCarModels, removeLoading, saveLoading } from "src/app/core/state/car-model/car-model.selectors";
import { CarModelComponent } from "./car-model-main.component";

describe("CarModelComponent", () => {
  const initialCarModelList = [
    { id: 1, name: "carmodel1", carMake: { id: 1, name: "carmake1" } } as CarModel,
    { id: 2, name: "carmodel2", carMake: { id: 1, name: "carmake1" } } as CarModel,
  ];
  const initialCarMakeList = [
    CarMake.fromObject({ id: 1, name: "carmake1" }),
    CarMake.fromObject({ id: 2, name: "carmake2" }),
  ];

  let store: MockStore;
  let fixture: ComponentFixture<CarModelComponent>;
  let component: CarModelComponent;
  let listSelector: MemoizedSelector<any, CarModel[], DefaultProjectorFn<CarModel[]>>;

  beforeEach(waitForAsync(() => {
    const logMock = jasmine.createSpyObj('NGXLogger', ['debug']);
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: NGXLogger, useValue: logMock },
      ],
      declarations: [CarModelComponent],
      imports: [
        ReactiveFormsModule,
        NgbCollapseModule,
      ],
    });
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    listSelector = store.overrideSelector(
      listCarModels,
      initialCarModelList
    );
    store.overrideSelector(
      listCarMakes,
      initialCarMakeList
    );
    store.overrideSelector(
      saveLoading,
      false
    );
    store.overrideSelector(
      removeLoading,
      false
    );
    fixture = TestBed.createComponent(CarModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callFake(() => {
      console.log("dispached");
    });
    spyOn(window, "confirm").and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('form should be validated properly', () => {
    const form = component.carModelForm;
    expect(form.valid).toBeFalsy();

    form.controls.name.setValue('Test Car Model 1');
    form.controls.carMakeId.setValue(1);

    expect(form.valid).toBeTruthy();
  });

  it('form submit should fail on invalid form', () => {
    const form = component.carModelForm;
    const nameInput = form.controls.name;
    nameInput.setValue(null);

    component.onCarModelFormSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('form submit should dispatch save action', () => {
    const form = component.carModelForm;

    form.controls.name.setValue('Test Car Model 1');
    form.controls.carMakeId.setValue(1);

    const carModel = {
      id: form.value.id,
      name: form.value.name,
      carMake: { id: 1 }
    } as CarModel;

    component.onCarModelFormSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      save({ carModel })
    );
  });

  it('should have correct number of car models on load', () => {
    expect(
      fixture.debugElement.queryAll(By.css('.item-container .list-group .list-group-item')).length
    ).toBe(initialCarModelList.length);
  });

  it('should have correct number of car models on change', () => {
    const newResult = [
      ...initialCarModelList,
      { id: 1, name: "carmodel1", carMake: { id: 1, name: "carmake1" } } as CarModel,
    ];
    listSelector.setResult(newResult);
    store.refreshState();
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('.item-container .list-group .list-group-item')).length
    ).toBe(newResult.length);

    listSelector.setResult(initialCarModelList);
    store.refreshState();
  });

  it('clicking edit should load edit form', () => {
    const item = fixture.debugElement.queryAll(By.css('.item-container .list-group .list-group-item'))[0];
    const h6 = item.query(By.css('h6'));

    item.query(By.css('button.btn.btn-edit')).nativeElement.click();

    const name = component.carModelForm.value.name;

    expect(h6.nativeElement.textContent).toEqual(name);
    expect(component.carModelFormCollapsed).toBeFalse();
  });

  it('clicking delete should trigger confirm dialog', () => {
    const item = fixture.debugElement.queryAll(By.css('.item-container .list-group .list-group-item'))[0];

    item.query(By.css('button.btn.btn-delete')).nativeElement.click();
    expect(window.confirm).toHaveBeenCalled();
  });

  it('clicking delete should trigger remove action', () => {
    const item = fixture.debugElement.queryAll(By.css('.item-container .list-group .list-group-item'))[0];

    item.query(By.css('button.btn.btn-delete')).nativeElement.click();
    expect(store.dispatch).toHaveBeenCalledWith(
      remove({ id: 1 })
    );
  });
});