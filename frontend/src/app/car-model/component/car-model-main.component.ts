import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CarMake } from '../../core/model/car-make.model';
import { listLoad, remove, save } from '../../core/state/car-model/car-model.actions';
import { CarModel } from '../../core/model/car-model.model';
import { listCarMakes } from '../../core/state/car-make/car-make.selectors';
import { listCarModels, removeLoading, saveLoading } from '../../core/state/car-model/car-model.selectors';

@Component({
  selector: 'car-model-main',
  templateUrl: './car-model-main.component.html',
  styleUrls: ['./car-model-main.component.css']
})
export class CarModelComponent implements OnInit, OnDestroy {

  @ViewChild("carModelFormContainer") carModelFormContainer!: NgbCollapse;

  carModelList: Observable<CarModel[]> = this.store.select(listCarModels);
  carMakeList: Observable<CarMake[]> = this.store.select(listCarMakes);
  formMode: string = "New";
  carModelFormSubmitted = false;
  carModelFormCollapsed = true;
  carModelFormSubmitting = false;
  carModelForm = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    carMakeId: ['', Validators.required],
  });
  subscriptions: Subscription = new Subscription();

  constructor(
    private logger: NGXLogger,
    private store: Store,
    private fb: FormBuilder) {
  }

  get form() {
    return this.carModelForm.controls;
  }

  private showCarModelForm() {
    if (this.carModelFormContainer?.collapsed) {
      this.carModelFormContainer?.toggle();
    }
  }

  private hideCarModelForm() {
    if (!this.carModelFormContainer?.collapsed) {
      this.carModelFormContainer?.toggle();
    }
  }

  ngOnInit(): void {
    this.store.dispatch(listLoad());
    this.subscriptions.add(
      this.store.select(saveLoading).subscribe((loading) => {
        this.logger.debug("state.carModel.save.loading", loading);
        this.carModelFormSubmitting = loading;
        if (!loading) {
          this.hideCarModelForm();
        }
      })
    );
    this.subscriptions.add(
      this.store.select(removeLoading).subscribe((loading) => {
        this.carModelFormSubmitting = loading;
        if (!loading) {
          this.hideCarModelForm();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCarModelFormSubmit() {
    this.logger.debug(this.carModelForm.value);
    if (this.carModelFormSubmitting) {
      return;
    }
    this.carModelFormSubmitted = true;
    if (this.carModelForm.valid) {

      const carModel = {
        id: this.carModelForm.value.id,
        name: this.carModelForm.value.name,
        carMake: { id: this.carModelForm.value.carMakeId },
      } as CarModel;
      this.store.dispatch(save({ carModel }));
    }
  }

  onItemEditClick(e: Event, carModel: CarModel) {
    e.preventDefault();
    this.carModelForm.reset();
    this.carModelForm.setValue({
      id: carModel?.id,
      name: carModel?.name,
      carMakeId: carModel?.carMake?.id
    });
    this.showCarModelForm();
  }

  onItemDeleteClick(e: Event, carModel: CarModel) {
    e.preventDefault();
    if (this.carModelFormSubmitting) {
      return;
    }
    this.logger.debug("delete", carModel);
    if (confirm(`Are you sure you want to delete '${carModel.name}'`)) {
      this.form.name.disable();
      this.store.dispatch(remove({ id: carModel.id }));
    }
  }

  onFormShown() {
    this.carModelFormSubmitted = false;
    this.formMode = "Cancel";
  }

  onFormHidden() {
    this.carModelForm.reset();
    this.carModelFormSubmitted = false;
    this.formMode = "New";
  }
}
