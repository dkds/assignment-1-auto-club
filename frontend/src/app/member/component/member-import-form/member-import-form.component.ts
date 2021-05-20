import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { JobStatusService } from '../../../core/service/job-status.service';
import { ToastService } from '../../../shared/service/toast.service';
import { Store } from '@ngrx/store';
import { importListRequest, importListRequestListenerEnded, importListRequestListenerStarted, listLoad } from '../../../core/state/member/member.actions';
import { filter, mergeAll, tap } from 'rxjs/operators';
import { importJobs, importLoading } from 'src/app/core/state/member/member.selectors';

@Component({
  selector: 'member-import-form',
  templateUrl: './member-import-form.component.html',
})
export class MemberImportFormComponent implements OnInit, OnDestroy {

  @ViewChild("memberImportFormContainer") memberImportFormContainer!: NgbCollapse;

  fileName?: string = "Choose file";
  formSubmitted = false;
  formSubmitting = false;
  collapsed = true;
  importForm = this.fb.group({
    file: ['', Validators.required],
    fileSource: ['', Validators.required]
  });
  subscriptions: Subscription = new Subscription();

  constructor(
    private logger: NGXLogger,
    private store: Store,
    private toastService: ToastService,
    private fb: FormBuilder,
    private jobStatus: JobStatusService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(importLoading).subscribe((loading) => {
        this.logger.debug('state.member.import.loading', loading);
        this.formSubmitting = loading;
      })
    );
    this.subscriptions.add(
      this.store.select(importJobs)
        .pipe(mergeAll(), filter(({ listening }) => !listening))
        .subscribe(({ jobId }) => {
          this.hideMemberImportForm();

          this.logger.debug("response", jobId);

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
          this.subscriptions.add(
            this.jobStatus.connect(jobId, 'import').subscribe({
              next: (data) => {
                progressToast.progressBar = {
                  type: "primary",
                  text: `importing ${data.progress.toFixed(1)}%`,
                  value: data.progress
                };
              },
              complete: () => {
                this.logger.debug("import complete");
                progressToast.autohide = true;
                progressToast.progressBar = {
                  type: "success",
                  text: 'import compelted',
                  value: 100
                };
                this.store.dispatch(listLoad());
              }
            })
          );
          this.store.dispatch(importListRequestListenerStarted({ jobId }));
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(importListRequestListenerEnded());
    this.toastService.removeAll();
  }

  get form() {
    return this.importForm.controls;
  }

  onFormSubmit() {
    this.logger.debug(this.importForm.value);
    if (this.formSubmitting) {
      return;
    }
    this.formSubmitted = true;
    if (this.importForm.valid) {
      this.logger.debug('file submit', this.importForm.value.fileSource);

      this.store.dispatch(importListRequest({ fileSource: this.importForm.value.fileSource }));
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