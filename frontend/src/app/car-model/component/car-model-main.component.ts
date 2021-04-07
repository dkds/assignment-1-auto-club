import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CarMake } from 'src/app/car-make/model/car-make.model';
import { CarMakeService } from 'src/app/car-make/service/car-make.service';
import { CarModel } from '../model/car-model.model';
import { CarModelService } from '../service/car-model.service';

@Component({
  selector: 'car-model-main',
  templateUrl: './car-model-main.component.html',
  styleUrls: ['./car-model-main.component.css']
})
export class CarModelComponent implements OnInit, OnDestroy {

  @ViewChild("carModelFormContainer") carModelFormContainer!: NgbCollapse;
  carModelList: CarModel[] = [];
  carMakeList: CarMake[] = [];
  formMode: string = "New";
  carModelFormSubmitted = false;
  carModelFormCollapsed = true;
  carModelFormSubmitting = false;
  carModelForm = this.formBuilder.group({
    id: [0],
    name: ['', Validators.required],
    carMakeId: ['', Validators.required],
  });
  subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private carMakeService: CarMakeService,
    private carModelService: CarModelService) {
  }

  get form() {
    return this.carModelForm.controls;
  }

  private showCarModelForm() {
    if (this.carModelFormContainer.collapsed) {
      this.carModelFormContainer.toggle();
    }
  }

  private hideCarModelForm() {
    if (!this.carModelFormContainer.collapsed) {
      this.carModelFormContainer.toggle();
    }
  }

  ngOnInit(): void {
    this.subscriptions.add(this.carMakeService.getCarMakes().subscribe((carMakes: CarMake[]) => {
      console.log("updated makes", carMakes);
      this.carMakeList = carMakes;
    }));
    this.subscriptions.add(this.carModelService.getCarModels().subscribe((carModels: CarModel[]) => {
      console.log("updated models", carModels);
      this.carModelList = carModels
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCarModelFormSubmit() {
    console.log(this.carModelForm.value);
    if (this.carModelFormSubmitting) {
      return;
    }
    this.carModelFormSubmitted = true;
    if (this.carModelForm.valid) {
      this.carModelFormSubmitting = true;
      this.subscriptions.add(this.carMakeService.getCarMake(this.form.carMakeId.value)
        .pipe(
          mergeMap((carMake: CarMake) => {
            const carModel = { id: this.carModelForm.value.id, name: this.carModelForm.value.name } as CarModel;
            carModel.carMake = carMake;
            return this.carModelService.saveCarModel(carModel);
          })
        ).subscribe(() => {
          this.carModelFormSubmitting = false;
          this.hideCarModelForm();
        }));
    }
  }

  onItemEditClick(e: Event, carModel: CarModel) {
    e.preventDefault();
    this.carModelForm.reset();
    this.carModelForm.setValue({ id: carModel.id, name: carModel.name, carMakeId: carModel.carMake?.id });
    this.showCarModelForm();
  }

  onItemDeleteClick(e: Event, carModel: CarModel) {
    e.preventDefault();
    if (this.carModelFormSubmitting) {
      return;
    }
    console.log("delete", carModel);
    if (confirm(`Are you sure you want to delete '${carModel.name}'`)) {
      this.form.name.disable();
      this.carModelFormSubmitting = true;
      this.subscriptions.add(this.carModelService.deleteCarModel(carModel).subscribe(() => {
        this.carModelFormSubmitting = false;
        this.hideCarModelForm();
      }));
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
