import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { listLoad, remove, save } from 'src/app/core/state/car-make/car-make.actions';
import { CarMake } from '../../core/model/car-make.model';
import { listCarMakes, removeLoading, saveLoading } from 'src/app/core/state/car-make/car-make.selectors';

@Component({
  selector: 'car-make-main',
  templateUrl: './car-make-main.component.html',
  styleUrls: ['./car-make-main.component.css']
})
export class CarMakeComponent implements OnInit, OnDestroy {

  @ViewChild("carMakeFormContainer") carMakeFormContainer!: NgbCollapse;

  carMakeList: Observable<CarMake[]> = this.store.select(listCarMakes);
  formMode: string = "New";
  carMakeFormSubmitted = false;
  carMakeFormCollapsed = true;
  carMakeFormSubmitting = false;
  carMakeForm = this.fb.group({
    id: [0],
    name: ['', Validators.required],
  });
  subscriptions: Subscription = new Subscription();

  constructor(
    private logger: NGXLogger,
    private store: Store,
    private fb: FormBuilder) {
  }

  get form() {
    return this.carMakeForm.controls;
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

  ngOnInit(): void {
    this.store.dispatch(listLoad());
    this.subscriptions.add(
      this.store.select(saveLoading).subscribe((loading) => {
        this.logger.debug("state.carMake.save.loading", loading);
        this.carMakeFormSubmitting = loading;
        if (!loading) {
          this.hideCarMakeForm();
        }
      })
    );
    this.subscriptions.add(
      this.store.select(removeLoading).subscribe((loading) => {
        this.carMakeFormSubmitting = loading;
        if (!loading) {
          this.hideCarMakeForm();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCarMakeFormSubmit() {
    this.logger.debug(this.carMakeForm.value);
    if (this.carMakeFormSubmitting) {
      return;
    }
    this.carMakeFormSubmitted = true;
    if (this.carMakeForm.valid) {
      this.store.dispatch(save({ carMake: this.carMakeForm.value }));
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
    if (this.carMakeFormSubmitting) {
      return;
    }
    this.logger.debug("delete", carMake);
    if (confirm(`Are you sure you want to delete '${carMake.name}'`)) {
      this.form.name.disable();
      this.store.dispatch(remove({ id: carMake.id }));
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
