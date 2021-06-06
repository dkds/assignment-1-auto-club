import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, mergeAll } from 'rxjs/operators';
import { JobStatusService } from 'src/app/core/service/job-status.service';
import { MemberActions } from 'src/app/core/state/member/member.actions';
import { ToastService } from 'src/app/shared/service/toast.service';
import { environment } from '../../../../environments/environment';
import { MemberSelectors } from 'src/app/core/state/member/member.selectors';

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

  criterias$ = this.store.select(MemberSelectors.exportCriterias);
  exportRequestLoading$ = this.store.select(MemberSelectors.exportLoading);

  formSubmitted = false;
  formCollapsed = true;
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

    this.store.dispatch(MemberActions.getExportCriteriaList());

    this.subscriptions.add(
      this.store.select(MemberSelectors.exportJobs)
        .pipe(
          mergeAll(),
          filter(({ listening }) => !listening)
        )
        .subscribe(({ jobId }) => {
          this.hideMemberExportForm();

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
                this.toastService.showTemplate(this.fileLink, {
                  fileURL: `${environment.fileDownloadLink}/${jobId}/csv`,
                  onDownload: (toast: any) => {
                    toast.autohide = true;
                  }
                },
                  { header: "Exporting done" }
                );
              }
            })
          );
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(MemberActions.exportListRequestListenerEnded());
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

  showMemberExportForm() {
    if (this.memberFormContainer?.collapsed) {
      this.memberFormContainer?.toggle();
    }
  }

  hideMemberExportForm() {
    if (!this.memberFormContainer?.collapsed) {
      this.memberFormContainer?.toggle();
    }
  }

  onSubmit() {
    if (this.criteria.code && this.criteria.variable) {
      this.store.dispatch(MemberActions.exportListRequest({ criteria: this.criteria.code, variables: { age: +this.criteria.variable } }));
      this.criteria = { code: null, variable: null }
    }
  }
}