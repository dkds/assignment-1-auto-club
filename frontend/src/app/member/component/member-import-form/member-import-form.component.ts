import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { JobStatusService } from '../../../core/service/job-status.service';
import { ToastService } from '../../../shared/service/toast.service';
import { Store } from '@ngrx/store';
import { exportListRequestSuccess, importList, importListSuccess, listLoad } from '../../../core/state/member/member.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'member-import-form',
  templateUrl: './member-import-form.component.html',
})
export class MemberImportFormComponent implements OnInit {

  @ViewChild("memberImportFormContainer") memberImportFormContainer!: NgbCollapse;

  fileName?: string = "Choose file";
  formSubmitted = false;
  formSubmitting = false;
  collapsed = true;
  importForm = this.formBuilder.group({
    file: ['', Validators.required],
    fileSource: ['', Validators.required]
  });
  subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private jobStatus: JobStatusService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select((state: any) => state.member.import.loading).subscribe((loading) => {
        console.log('state.member.import.loading', loading);
        this.formSubmitting = loading;
      })
    );
    this.subscriptions.add(
      this.store.select((state: any) => state.member.import.jobId)
        .pipe(filter((jobId: string) => jobId != null))
        .subscribe((jobId: string) => {
          this.hideMemberImportForm();

          console.log("response", jobId);

          const progressToast = this.toastService.showProgress({
            progressBar: {
              type: "dark",
              value: 100,
              striped: true,
              animated: true,
              text: "Preparing import..."
            },
            header: "Importing members"
          });
          this.jobStatus.connect(jobId, 'import').subscribe({
            next: (data) => {
              console.log("component listener", data);
              progressToast.progressBar = {
                type: "primary",
                text: `importing ${data.progress.toFixed(1)}%`,
                value: data.progress
              };
            },
            complete: () => {
              console.log("import complete");
              progressToast.autohide = true;
              progressToast.progressBar = {
                type: "success",
                text: 'import compelted',
                value: 100
              };
              this.store.dispatch(listLoad());
            }
          });
        })
    );
  }

  get form() {
    return this.importForm.controls;
  }

  onFormSubmit() {
    console.log(this.importForm.value);
    if (this.formSubmitting) {
      return;
    }
    this.formSubmitted = true;
    if (this.importForm.valid) {
      console.log('file submit', this.importForm.value.fileSource);

      this.store.dispatch(importList({ fileSource: this.importForm.value.fileSource }));
    }
  }

  toggle() {
    this.memberImportFormContainer.toggle();
  }

  onFileChange(event: Event) {
    if ((event.target as HTMLInputElement).files && (event.target as HTMLInputElement).files?.length) {
      const file = (event.target as HTMLInputElement).files?.item(0);
      this.fileName = file?.name;
      this.importForm.patchValue({
        fileSource: file
      });
    }
  }

  onFormShown() {
    this.formSubmitted = false;
    this.formSubmitting = false;
  }

  onFormHidden() {
    this.importForm.reset();
    this.fileName = "Choose file";
    this.formSubmitted = false;
    this.formSubmitting = false;
  }

  private hideMemberImportForm() {
    if (!this.memberImportFormContainer?.collapsed) {
      this.memberImportFormContainer?.toggle();
    }
  }
}