import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Observable, Subscription } from 'rxjs';
import { CarModel } from 'src/app/core/model/car-model.model';
import { MemberActions } from 'src/app/core/state/member/member.actions';
import { MemberForm } from '../../../core/model/member-form.model';
import { Member } from '../../../core/model/member.model';
import { MemberSelectors } from 'src/app/core/state/member/member.selectors';
import { CarModelActions } from 'src/app/core/state/car-model/car-model.actions';
import { CarModelSelectors } from 'src/app/core/state/car-model/car-model.selectors';

@Component({
  selector: 'member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css'],
})
export class MemberFormComponent implements OnInit, OnDestroy {

  @ViewChild("memberFormContainer") memberFormContainer!: NgbCollapse;
  @Output("formShown") formShownEmitter = new EventEmitter();
  @Output("formHidden") formHiddenEmitter = new EventEmitter();

  carModelList$: Observable<CarModel[]> = this.store.select(CarModelSelectors.listCarModels);
  memberSaveLoading$: Observable<boolean> = this.store.select(MemberSelectors.saveLoading);

  formSubmitted = false;
  formCollapsed = true;
  collapsed = true;
  memberForm = this.fb.group({
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
    private logger: NGXLogger,
    private store: Store,
    private fb: FormBuilder) { }

  get form() {
    return this.memberForm.controls;
  }

  ngOnInit(): void {

    this.store.dispatch(CarModelActions.listLoad());

    this.subscriptions.add(
      this.store.select(MemberSelectors.changeFinished).subscribe((finished) => {
        this.logger.debug("state.member.changeFinished", finished);
        if (finished) {
          this.hide();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onMemberFormSubmit() {
    this.logger.debug(this.memberForm.value);
    this.formSubmitted = true;
    if (this.memberForm.valid) {

      const member = {
        id: this.memberForm.value.id,
        firstName: this.memberForm.value.firstName,
        lastName: this.memberForm.value.lastName,
        email: this.memberForm.value.email,
        vin: this.memberForm.value.vinNumber,
        carModel: { id: this.memberForm.value.carModelId },
        mfd: DateTime.fromObject(this.memberForm.value.mfd).toISODate()
      } as Member;

      this.store.dispatch(MemberActions.save({ member }));
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
    this.memberFormContainer?.toggle();
  }

  show() {
    if (this.memberFormContainer?.collapsed) {
      this.memberFormContainer?.toggle();
    }
  }

  hide() {
    if (!this.memberFormContainer?.collapsed) {
      this.memberFormContainer?.toggle();
    }
  }
}