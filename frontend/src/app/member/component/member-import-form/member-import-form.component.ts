import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { JobStatusService } from '../../../core/service/job-status.service';
import { ToastService } from '../../../shared/service/toast.service';
import { Store } from '@ngrx/store';
import { MemberActions } from '../../../core/state/member/member.actions';
import { filter, mergeAll, tap } from 'rxjs/operators';
import { MemberSelectors } from 'src/app/core/state/member/member.selectors';

@Component({
  selector: 'member-import-form',
  templateUrl: './member-import-form.component.html',
})
export class MemberImportFormComponent implements OnInit, OnDestroy {

  @ViewChild("memberImportFormContainer") memberImportFormContainer!: NgbCollapse;

  memberImportLoading$ = this.store.select(MemberSelectors.importLoading);

  fileName?: string = "Choose file";
  formSubmitted = false;
  collapsed = true;
  importForm = this.fb.group({
    file: ['', Validators.required],
    fileSource: ['', Validators.required]
  });
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private logger: NGXLogger,
    private toastService: ToastService,
    private jobStatus: JobStatusService) { }

  ngOnInit(): void {

    this.subscriptions.add(
      this.store.select(MemberSelectors.importJobs)
        .pipe(
          mergeAll(),
          filter(({ listening }) => !listening)
        )
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
              }
            })
          );
        })
    );

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(MemberActions.importListRequestListenerEnded());
    this.toastService.removeAll();
  }

  get form() {
    return this.importForm.controls;
  }

  onFormSubmit() {
    this.logger.debug(this.importForm.value);
    this.formSubmitted = true;
    if (this.importForm.valid) {
      this.logger.debug('file submit', this.importForm.value.fileSource);

      this.store.dispatch(MemberActions.importListRequest({ fileSource: this.importForm.value.fileSource }));
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
  }

  onFormHidden() {
    this.importForm.reset();
    this.fileName = "Choose file";
    this.formSubmitted = false;
  }

  private hideMemberImportForm() {
    if (!this.memberImportFormContainer?.collapsed) {
      this.memberImportFormContainer?.toggle();
    }
  }
}