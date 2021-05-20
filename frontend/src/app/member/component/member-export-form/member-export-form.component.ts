import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, mergeAll } from 'rxjs/operators';
import { JobStatusService } from 'src/app/core/service/job-status.service';
import { exportListRequest, exportListRequestCompleted, exportListRequestListenerEnded, exportListRequestListenerStarted, getExportCriteriaList } from 'src/app/core/state/member/member.actions';
import { ToastService } from 'src/app/shared/service/toast.service';
import { environment } from '../../../../environments/environment';
import { exportCriterias, exportJobs, exportLoading } from 'src/app/core/state/member/member.selectors';

@Component({
  selector: 'member-export-form',
  templateUrl: './member-export-form.component.html',
  styleUrls: ['./member-export-form.component.css'],
})
export class MemberExportFormComponent implements OnInit, OnDestroy {

  @ViewChild("memberFormContainer") memberFormContainer!: NgbCollapse;
  @ViewChild("fileLink") fileLink!: TemplateRef<any>;
  @Output("formShown") formShownEmitter = new EventEmitter();
  @Output("formHidden") formHiddenEmitter = new EventEmitter();

  criterias = this.store.select(exportCriterias);
  formSubmitted = false;
  formCollapsed = true;
  formSubmitting = false;
  collapsed = true;
  criteria: { code: string | null, variable: string | null } = {
    code: null,
    variable: null,
  };
  private subscriptions: Subscription = new Subscription();

  constructor(
    private logger: NGXLogger,
    private store: Store,
    private toastService: ToastService,
    private jobStatus: JobStatusService) { }

  ngOnInit(): void {
    this.store.dispatch(getExportCriteriaList());
    this.subscriptions.add(
      this.store.select(exportLoading).subscribe((loading) => {
        this.logger.debug('state.member.export.loading', loading);
        this.formSubmitting = loading;
      })
    );
    this.subscriptions.add(
      this.store.select(exportJobs)
        .pipe(mergeAll(), filter(({ listening }) => !listening))
        .subscribe(({ jobId }) => {
          this.hide();

          this.logger.debug("response", jobId);

          const progressToast = this.toastService.showProgress({
            progressBar: {
              type: "dark",
              value: 100,
              striped: true,
              animated: true,
              text: "Preparing export..."
            },
            header: "Exporting members"
          });
          this.subscriptions.add(
            this.jobStatus.connect(jobId, 'export').subscribe({
              next: (data) => {
                progressToast.progressBar = {
                  type: "primary",
                  text: `exporting ${data.progress}%`,
                  value: data.progress
                };
              },
              complete: () => {
                this.logger.debug("export complete");
                progressToast.autohide = true;
                progressToast.progressBar = {
                  type: "success",
                  text: 'Exporting done',
                  value: 100
                };
                this.store.dispatch(exportListRequestCompleted({ jobId }));
                this.toastService.showTemplate(this.fileLink, {
                  fileURL: `${environment.apiHost}/export/download/${jobId}/csv`,
                  onDownload: (toast: any) => {
                    toast.autohide = true;
                  }
                },
                  { header: "Exporting done" }
                );
              }
            })
          );
          this.store.dispatch(exportListRequestListenerStarted({ jobId }));
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(exportListRequestListenerEnded());
    this.toastService.removeAll();
  }

  onFormShown() {
    this.formSubmitted = false;
    this.formShownEmitter.emit();
  }

  onFormHidden() {
    this.formSubmitted = false;
    this.formHiddenEmitter.emit();
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

  onSubmit() {
    if (this.criteria.code && this.criteria.variable) {
      this.store.dispatch(exportListRequest({ criteria: this.criteria.code, variables: { age: +this.criteria.variable } }));
      this.criteria = { code: null, variable: null }
    }
  }
}