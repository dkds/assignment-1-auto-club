import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { MemoizedSelector, DefaultProjectorFn } from "@ngrx/store";
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NGXLogger } from "ngx-logger";
import { CarMake } from "src/app/core/model/car-make.model";
import { remove, save } from "src/app/core/state/car-make/car-make.actions";
import { listCarMakes, removeLoading, saveLoading } from "src/app/core/state/car-make/car-make.selectors";
import { CarMakeComponent } from "./car-make-main.component";

describe("CarMakeComponent", () => {
  const initialCarMakeList = [
    CarMake.fromObject({ id: 1, name: "carmake1" }),
    CarMake.fromObject({ id: 2, name: "carmake2" }),
  ];

  let store: MockStore;
  let fixture: ComponentFixture<CarMakeComponent>;
  let component: CarMakeComponent;
  let listSelector: MemoizedSelector<any, CarMake[], DefaultProjectorFn<CarMake[]>>;

  beforeEach(waitForAsync(() => {
    const logMock = jasmine.createSpyObj('NGXLogger', ['debug']);
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: NGXLogger, useValue: logMock },
      ],
      declarations: [CarMakeComponent],
      imports: [
        ReactiveFormsModule,
        NgbCollapseModule,
      ],
    });
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    listSelector = store.overrideSelector(
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
    fixture = TestBed.createComponent(CarMakeComponent);
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
    const form = component.carMakeForm;
    expect(form.valid).toBeFalsy();

    const nameInput = form.controls.name;
    nameInput.setValue('Test Car Make 1');
    expect(form.valid).toBeTruthy();
  });

  it('form submit should fail on invalid form', () => {
    const form = component.carMakeForm;
    const nameInput = form.controls.name;
    nameInput.setValue(null);

    component.onCarMakeFormSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('form submit should dispatch save action', () => {
    const form = component.carMakeForm;
    const nameInput = form.controls.name;
    nameInput.setValue('Test Car Make 1');

    component.onCarMakeFormSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      save({ carMake: form.value })
    );
  });

  it('should have correct number of car makes on load', () => {
    expect(
      fixture.debugElement.queryAll(By.css('.item-container .list-group .list-group-item')).length
    ).toBe(initialCarMakeList.length);
  });

  it('should have correct number of car makes on change', () => {
    const newResult = [
      ...initialCarMakeList,
      CarMake.fromObject({ id: 3, name: "carmake3" }),
    ];
    listSelector.setResult(newResult);
    store.refreshState();
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('.item-container .list-group .list-group-item')).length
    ).toBe(newResult.length);

    listSelector.setResult(initialCarMakeList);
    store.refreshState();
  });

  it('clicking edit should load edit form', () => {
    const item = fixture.debugElement.queryAll(By.css('.item-container .list-group .list-group-item'))[0];
    const h6 = item.query(By.css('h6'));

    item.query(By.css('button.btn.btn-edit')).nativeElement.click();

    const name = component.carMakeForm.value.name;

    expect(h6.nativeElement.textContent).toEqual(name);
    expect(component.carMakeFormCollapsed).toBeFalse();
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