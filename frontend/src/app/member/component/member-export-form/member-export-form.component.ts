import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { JobStatusService } from 'src/app/core/service/job-status.service';
import { exportListRequest, exportListSuccess, getExportCriteriaList } from 'src/app/core/state/member/member.actions';
import { ToastService } from 'src/app/shared/service/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'member-export-form',
  templateUrl: './member-export-form.component.html',
  styleUrls: ['./member-export-form.component.css'],
})
export class MemberExportFormComponent implements OnInit {

  @ViewChild("memberFormContainer") memberFormContainer!: NgbCollapse;
  @ViewChild("fileLink") fileLink!: TemplateRef<any>;
  @Output("formShown") formShownEmitter = new EventEmitter();
  @Output("formHidden") formHiddenEmitter = new EventEmitter();

  criterias = this.store.select((state: any) => state.member.export.criterias);
  formSubmitted = false;
  formCollapsed = true;
  formSubmitting = false;
  collapsed = true;
  // fileURL?: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store,
    private toastService: ToastService,
    private jobStatus: JobStatusService) { }

  ngOnInit(): void {
    this.store.dispatch(getExportCriteriaList());
    this.subscriptions.add(
      this.store.select((state: any) => state.member.export.loading).subscribe((loading) => {
        console.log('state.member.export.loading', loading);
        this.formSubmitting = loading;
      })
    );
    this.subscriptions.add(
      this.store.select((state: any) => state.member.export.jobId)
        .pipe(filter((jobId: string) => jobId != null))
        .subscribe((jobId: string) => {
          this.hide();

          console.log("response", jobId);

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
          this.jobStatus.connect(jobId, 'export').subscribe({
            next: (data) => {
              progressToast.progressBar = {
                type: "primary",
                text: `exporting ${data.progress}%`,
                value: data.progress
              };
            },
            complete: () => {
              console.log("export complete");
              progressToast.autohide = true;
              progressToast.progressBar = {
                type: "success",
                text: 'Exporting done',
                value: 100
              };
              this.store.dispatch(exportListSuccess());
              this.toastService.showTemplate(this.fileLink, {
                fileURL: `${environment.apiHost}/export/download/${jobId}/csv`,
                onDownload: (toast:any) => {
                  toast.autohide = true;
                }
              },
                { header: "Exporting done" }
              );
            }
          });
        })
    );
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

  onSubmit(event: Event, criteria: string, variable: string) {
    event.preventDefault()
    this.store.dispatch(exportListRequest({ criteria, variables: { age: +variable } }));
  }
}