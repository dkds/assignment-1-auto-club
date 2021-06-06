import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { EffectsRootModule } from "@ngrx/effects";
import { MemoizedSelector, DefaultProjectorFn } from "@ngrx/store";
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NGXLogger } from "ngx-logger";
import { CarMake } from "../../core/model/car-make.model";
import { CarModel } from "../../core/model/car-model.model";
import { carMakeInitialState } from "../../core/state/car-make/car-make.reducers";
import { CarMakeSelectors } from "../../core/state/car-make/car-make.selectors";
import { CarModelActions } from "../../core/state/car-model/car-model.actions";
import { carModelInitialState } from "../../core/state/car-model/car-model.reducers";
import { CarModelSelectors } from "../../core/state/car-model/car-model.selectors";
import { SharedModule } from "../../shared/shared.module";
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
    const effects = jasmine.createSpy('EffectsRootModule');
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            carMake: carMakeInitialState,
            carModel: carModelInitialState,
          }
        }),
        { provide: NGXLogger, useValue: logMock },
        { provide: EffectsRootModule, useValue: effects },
      ],
      declarations: [CarModelComponent],
      imports: [
        SharedModule,
        ReactiveFormsModule,
        NgbCollapseModule,
      ],
    });
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);

    listSelector = store.overrideSelector(CarModelSelectors.listCarModels, initialCarModelList);
    store.overrideSelector(CarMakeSelectors.listCarMakes, initialCarMakeList);
    store.overrideSelector(CarModelSelectors.saveLoading, false);
    store.overrideSelector(CarModelSelectors.removeLoading, false);
    store.overrideSelector(CarModelSelectors.changeFinished, false);
    store.overrideSelector(CarModelSelectors.changeError, false);

    fixture = TestBed.createComponent(CarModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(store, 'dispatch').and.callFake(() => console.log("dispached"));
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
    component.carModelForm.controls.name.setValue(null);

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
      CarModelActions.save({ carModel })
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
      CarModelActions.remove({ carModel: { ...initialCarModelList[0] } })
    );
  });
});