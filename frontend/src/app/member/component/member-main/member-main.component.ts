import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Observable, of, Subscription } from 'rxjs';
import { Member } from '../../../core/model/member.model';
import { SortMode } from '../../../core/model/sort-mode.enum';
import { MemberActions } from '../../../core/state/member/member.actions';
import { MemberSelectors } from '../../../core/state/member/member.selectors';
import { MemberFormComponent } from '../member-form/member-form.component';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'member-main',
  templateUrl: './member-main.component.html',
  styleUrls: ['./member-main.component.css']
})
export class MemberComponent implements OnInit, OnDestroy {

  @ViewChild("memberFormContainer") memberForm!: MemberFormComponent;

  memberList$: Observable<Member[]> = this.store.select(MemberSelectors.listMembers);
  sortModes$: Observable<{ name: string, text: SortMode }[]> = of(Object.entries(SortMode).map(([name, text]) => ({ name, text })));
  memberListPageInfo$: Observable<{ pageSize: number, totalCount: number, currentPage: number }> = this.store.select(MemberSelectors.listPageInfo);
  memberSaveLoading$: Observable<boolean> = this.store.select(MemberSelectors.saveLoading);
  memberRemoveLoading$: Observable<boolean> = this.store.select(MemberSelectors.removeLoading);

  memberFormMode: string = "New";
  private subscriptions: Subscription = new Subscription();

  constructor(
    private logger: NGXLogger,
    private toastService: ToastService,
    private store: Store) { }

  ngOnInit(): void {

    this.store.dispatch(MemberActions.listLoad());

    this.subscriptions.add(
      this.store.select(MemberSelectors.changeFinished).subscribe((finished) => {
        this.logger.debug("state.member.changeFinished", finished);
        if (finished) {
          this.memberForm?.hide();
        }
      })
    );

    this.subscriptions.add(
      this.store.select(MemberSelectors.changeError).subscribe((error) => {
        this.logger.debug("state.member.changeError", error);
        if (error) {
          this.toastService.showText(error, { classname: 'bg-danger text-light', autohide: true, autohideDelay: 8000 });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onItemEditClick(e: Event, member: Member) {
    e.preventDefault();

    this.memberForm.reset();
    this.memberForm.setValue({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      vinNumber: member.vin,
      carModelId: member?.carModel?.id,
      mfd: DateTime.fromISO(member.mfd).toObject(),
    });
    this.memberForm.show();
  }

  onItemDeleteClick(e: Event, member: Member) {
    e.preventDefault();

    this.logger.debug("delete", member);
    if (confirm(`Are you sure you want to delete '${member.firstName} ${member.lastName}'`)) {

      this.store.dispatch(MemberActions.remove({ member }));
    }
  }

  onSortModeChange(event: Event) {
    const sortMode = (event.target as HTMLInputElement).value;
    this.store.dispatch(MemberActions.listSort({ sortMode }));
  }

  onSearch(query: string) {
    this.logger.debug('search', query);
    this.store.dispatch(MemberActions.listSearch({ query }));
  }

  onPageChange(currentPage: any) {
    if (!currentPage) {
      currentPage = 1;
    }
    this.store.dispatch(MemberActions.listNavigate({ currentPage }));
  }

  onFormShown() {
    this.memberFormMode = "Cancel"
  }

  onFormHidden() {
    this.memberFormMode = "New"
  }
}
