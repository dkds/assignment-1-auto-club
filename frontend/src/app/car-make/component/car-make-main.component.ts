import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CarMake } from '../../core/model/car-make.model';
import { CarMakeActions } from 'src/app/core/state/car-make/car-make.actions';
import { CarMakeSelectors } from 'src/app/core/state/car-make/car-make.selectors';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'car-make-main',
  templateUrl: './car-make-main.component.html',
  styleUrls: ['./car-make-main.component.css']
})
export class CarMakeComponent implements OnInit, OnDestroy {

  @ViewChild("carMakeFormContainer") carMakeFormContainer!: NgbCollapse;

  carMakeList$: Observable<CarMake[]> = this.store.select(CarMakeSelectors.listCarMakes);
  carMakeSaveLoading$: Observable<boolean> = this.store.select(CarMakeSelectors.saveLoading);
  carMakeRemoveLoading$: Observable<boolean> = this.store.select(CarMakeSelectors.removeLoading);

  formMode: string = "New";
  carMakeFormSubmitted = false;
  carMakeFormCollapsed = true;

  carMakeForm = this.fb.group({
    id: [0],
    name: ['', Validators.required],
  });
  private subscriptions: Subscription = new Subscription();

  constructor(
    private logger: NGXLogger,
    private store: Store,
    private toastService: ToastService,
    private fb: FormBuilder) {
  }

  get form() {
    return this.carMakeForm.controls;
  }

  ngOnInit(): void {

    this.store.dispatch(CarMakeActions.listLoad());

    this.subscriptions.add(
      this.store.select(CarMakeSelectors.changeFinished).subscribe((finished) => {
        this.logger.debug("state.carMake.changeFinished", finished);
        if (finished) {
          this.hideCarMakeForm();
        }
      })
    );

    this.subscriptions.add(
      this.store.select(CarMakeSelectors.changeError).subscribe((error) => {
        this.logger.debug("state.carMake.changeError", error);
        if (error) {
          this.toastService.showText(error, { classname: 'bg-danger text-light', autohide: true, autohideDelay: 8000 });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCarMakeFormSubmit() {
    this.logger.debug("submit", this.carMakeForm.value);
    this.carMakeFormSubmitted = true;
    if (this.carMakeForm.valid) {

      this.store.dispatch(CarMakeActions.save({ carMake: { ...this.carMakeForm.value } }));
    }
  }

  onItemEditClick(e: Event, carMake: CarMake) {
    e.preventDefault();

    this.carMakeForm.reset();
    this.carMakeForm.setValue(carMake);
    this.showCarMakeForm();
  }

  onItemDeleteClick(e: Event, carMake: CarMake) {
    e.preventDefault();

    this.logger.debug("delete", carMake);
    if (confirm(`Are you sure you want to delete '${carMake.name}'`)) {

      this.store.dispatch(CarMakeActions.remove({ carMake: { ...carMake } }));
    }
  }

  private showCarMakeForm() {
    if (this.carMakeFormContainer?.collapsed) {
      this.carMakeFormContainer?.toggle();
    }
  }

  private hideCarMakeForm() {
    if (!this.carMakeFormContainer?.collapsed) {
      this.carMakeFormContainer?.toggle();
    }
  }

  onFormShown() {
    this.carMakeFormSubmitted = false;
    this.formMode = "Cancel";
  }

  onFormHidden() {
    this.carMakeForm.reset();
    this.carMakeFormSubmitted = false;
    this.formMode = "New";
  }
}
