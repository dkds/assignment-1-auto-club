import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CarModel } from 'src/app/car-model/model/car-model.model';
import { CarModelService } from 'src/app/car-model/service/car-model.service';
import { MemberForm } from '../../model/member-form.model';
import { Member } from '../../model/member.model';
import { MemberService } from '../../service/member.service';

@Component({
  selector: 'member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css'],
})
export class MemberFormComponent implements OnInit {

  @ViewChild("memberFormContainer") memberFormContainer!: NgbCollapse;
  @Output("formShown") formShownEmitter = new EventEmitter();
  @Output("formHidden") formHiddenEmitter = new EventEmitter();

  carModelList: CarModel[] = [];
  formSubmitted = false;
  formCollapsed = true;
  formSubmitting = false;
  collapsed = true;
  memberForm = this.formBuilder.group({
    id: [0],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    carModelId: ['', Validators.required],
    vinNumber: ['', Validators.required],
    mfd: [DateTime.now().toObject(), Validators.required],
  });
  private subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private carModelService: CarModelService,
    private memberService: MemberService) { }

  get form() {
    return this.memberForm.controls;
  }

  ngOnInit(): void {
    this.subscriptions.add(this.carModelService.getCarModels().subscribe((carModels: CarModel[]) => {
      console.log("loaded makes", carModels);
      this.carModelList = carModels;
    }));
  }

  onMemberFormSubmit() {
    console.log(this.memberForm.value);
    if (this.formSubmitting) {
      return;
    }
    this.formSubmitted = true;
    if (this.memberForm.valid) {
      this.formSubmitting = true;
      this.subscriptions.add(this.carModelService.getCarModel(this.form.carModelId.value)
        .pipe(
          mergeMap((carModel: CarModel) => {
            const member = {
              id: this.memberForm.value.id,
              firstName: this.memberForm.value.firstName,
              lastName: this.memberForm.value.lastName,
              email: this.memberForm.value.email,
              vin: this.memberForm.value.vinNumber,
              mfd: DateTime.fromObject(this.memberForm.value.mfd).toISODate()
            } as Member;
            member.carModel = carModel;
            return this.memberService.saveMember(member);
          })
        ).subscribe(() => {
          this.formSubmitting = false;
          this.hide();
        }));
    }
  }

  onFormShown() {
    this.formSubmitted = false;
    this.formShownEmitter.emit();
  }

  onFormHidden() {
    this.reset();
    this.formSubmitted = false;
    this.formHiddenEmitter.emit();
  }

  setValue(newValue: MemberForm) {
    this.reset();
    this.memberForm.setValue(newValue);
  }

  reset() {
    this.memberForm.reset();
  }

  toggle() {
    this.memberFormContainer.toggle();
  }

  show() {
    if (this.memberFormContainer.collapsed) {
      this.memberFormContainer.toggle();
    }
  }

  hide() {
    if (!this.memberFormContainer.collapsed) {
      this.memberFormContainer.toggle();
    }
  }
}