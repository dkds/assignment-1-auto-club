import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CarMake } from '../../core/model/car-make.model';
import { CarModelActions } from '../../core/state/car-model/car-model.actions';
import { CarModel } from '../../core/model/car-model.model';
import { CarModelSelectors } from '../../core/state/car-model/car-model.selectors';
import { CarMakeSelectors } from 'src/app/core/state/car-make/car-make.selectors';
import { ToastService } from 'src/app/shared/service/toast.service';
import { CarMakeActions } from 'src/app/core/state/car-make/car-make.actions';

@Component({
  selector: 'car-model-main',
  templateUrl: './car-model-main.component.html',
  styleUrls: ['./car-model-main.component.css']
})
export class CarModelComponent implements OnInit, OnDestroy {

  @ViewChild("carModelFormContainer") carModelFormContainer!: NgbCollapse;

  carMakeList$: Observable<CarMake[]> = this.store.select(CarMakeSelectors.listCarMakes);
  carModelList$: Observable<CarModel[]> = this.store.select(CarModelSelectors.listCarModels);
  carModelSaveLoading$: Observable<boolean> = this.store.select(CarModelSelectors.saveLoading);
  carModelRemoveLoading$: Observable<boolean> = this.store.select(CarModelSelectors.removeLoading);

  formMode: string = "New";
  carModelFormSubmitted = false;
  carModelFormCollapsed = true;
  carModelFormSubmitting = false;
  carModelForm = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    carMakeId: ['', Validators.required],
  });
  private subscriptions: Subscription = new Subscription();

  constructor(
    private logger: NGXLogger,
    private store: Store,
    private toastService: ToastService,
    private fb: FormBuilder) {
  }

  get form() {
    return this.carModelForm.controls;
  }

  ngOnInit(): void {

    this.store.dispatch(CarMakeActions.listLoad());
    this.store.dispatch(CarModelActions.listLoad());

    this.subscriptions.add(
      this.store.select(CarModelSelectors.changeFinished).subscribe((finished) => {
        this.logger.debug("state.carModel.changeFinished", finished);
        if (finished) {
          this.hideCarModelForm();
        }
      })
    );

    this.subscriptions.add(
      this.store.select(CarModelSelectors.changeError).subscribe((error) => {
        this.logger.debug("state.carModel.changeError", error);
        if (error) {
          this.toastService.showText(error, { classname: 'bg-danger text-light', autohide: true, autohideDelay: 8000 });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCarModelFormSubmit() {
    this.logger.debug(this.carModelForm.value);
    this.carModelFormSubmitted = true;
    if (this.carModelForm.valid) {

      const carModel = {
        id: this.carModelForm.value.id,
        name: this.carModelForm.value.name,
        carMake: { id: this.carModelForm.value.carMakeId },
      } as CarModel;

      this.store.dispatch(CarModelActions.save({ carModel }));
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

    this.logger.debug("delete", carModel);
    if (confirm(`Are you sure you want to delete '${carModel.name}'`)) {

      this.store.dispatch(CarModelActions.remove({ carModel: { ...carModel } }));
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
}
