import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { JobStatusService } from '../../service/job-status.service';
import { MemberService } from '../../service/member.service';
import { ToastService } from '../../../shared/service/toast.service';

@Component({
  selector: 'member-import-form',
  templateUrl: './member-import-form.component.html',
})
export class MemberImportFormComponent {

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
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private jobStatus: JobStatusService,
    private memberService: MemberService) { }


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
      this.formSubmitting = true;
      const formData = new FormData();
      formData.append("file", this.importForm.value.fileSource);
      console.log(this.importForm.value.fileSource);
      this.subscriptions.add(this.memberService.importFile(formData).subscribe((response) => {
        this.formSubmitting = false;
        this.hideMemberImportForm();

        console.log("response", response);

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
        this.jobStatus.connect(response?.jobId, 'import').subscribe({
          next: (data) => {
            console.log("component listener", data);
            progressToast.progressBar = {
              type: "primary",
              text: `importing ${data.progress}%`,
              value: data.progress
            };
          },
          complete: () => {
            console.log("import complete");
            progressToast.autohide = true;
            progressToast.progressBar = {
              type: "success",
              text: 'importing done',
              value: 100
            };
            this.memberService.refresh();
          }
        });
      }));
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
    this.formSubmitted = false;
    this.formSubmitting = false;
  }

  private hideMemberImportForm() {
    if (!this.memberImportFormContainer.collapsed) {
      this.memberImportFormContainer.toggle();
    }
  }

}