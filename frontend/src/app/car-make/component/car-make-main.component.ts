import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CarMake } from '../model/car-make.model';
import { CarMakeService } from '../service/car-make.service';

@Component({
  selector: 'car-make-main',
  templateUrl: './car-make-main.component.html',
  styleUrls: ['./car-make-main.component.css']
})
export class CarMakeComponent implements OnInit, OnDestroy {

  @ViewChild("carMakeFormContainer") carMakeFormContainer!: NgbCollapse;
  carMakeList: CarMake[] = [];
  formMode: string = "New";
  carMakeFormSubmitted = false;
  carMakeFormCollapsed = true;
  carMakeFormSubmitting = false;
  carMakeForm = this.formBuilder.group({
    id: [0],
    name: ['', Validators.required],
  });
  subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private carMakeService: CarMakeService) {
  }

  get form() {
    return this.carMakeForm.controls;
  }

  private showCarMakeForm() {
    if (this.carMakeFormContainer.collapsed) {
      this.carMakeFormContainer.toggle();
    }
  }

  private hideCarMakeForm() {
    if (!this.carMakeFormContainer.collapsed) {
      this.carMakeFormContainer.toggle();
    }
  }

  ngOnInit(): void {
    this.subscriptions.add(this.carMakeService.getCarMakes().subscribe((carMakes: CarMake[]) => {
      console.log("updated", carMakes);
      this.carMakeList = carMakes
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCarMakeFormSubmit() {
    console.log(this.carMakeForm.value);
    if (this.carMakeFormSubmitting) {
      return;
    }
    this.carMakeFormSubmitted = true;
    if (this.carMakeForm.valid) {
      this.carMakeFormSubmitting = true;
      this.subscriptions.add(this.carMakeService.saveCarMake(this.carMakeForm.value as CarMake).subscribe(() => {
        this.carMakeFormSubmitting = false;
        this.hideCarMakeForm();
      }));
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
    console.log("delete", carMake);
    if (confirm(`Are you sure you want to delete '${carMake.name}'`)) {
      this.form.name.disable();
      this.carMakeFormSubmitting = true;
      this.subscriptions.add(this.carMakeService.deleteCarMake(carMake).subscribe(() => {
        this.carMakeFormSubmitting = false;
        this.hideCarMakeForm();
      }));
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
