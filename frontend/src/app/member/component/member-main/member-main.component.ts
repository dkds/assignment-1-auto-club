import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Observable, Subscription } from 'rxjs';
import { Member } from '../../../core/model/member.model';
import { SortMode } from '../../../core/model/sort-mode.enum';
import { listLoad, listNavigate, remove, listSort, listSearch } from '../../../core/state/member/member.actions';
import { listMembers, listTotalCount, removeLoading, saveLoading } from '../../../core/state/member/member.selectors';
import { MemberFormComponent } from '../member-form/member-form.component';

@Component({
  selector: 'member-main',
  templateUrl: './member-main.component.html',
  styleUrls: ['./member-main.component.css']
})
export class MemberComponent implements OnInit, OnDestroy {

  @ViewChild("memberFormContainer") memberForm!: MemberFormComponent;

  subscriptions: Subscription = new Subscription();
  memberList: Observable<Member[]> = this.store.select(listMembers);
  totalMemberSize: Observable<number> = this.store.select(listTotalCount);
  sortModes: { name: string, text: SortMode }[] = Object.entries(SortMode).map(([name, text]) => ({ name, text }));

  memberFormMode: string = "New";
  pageSize = 10;
  listProcessing = false;

  constructor(
    private logger: NGXLogger,
    private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(listLoad());

    this.subscriptions.add(
      this.store.select(removeLoading).subscribe((loading) => {
        this.listProcessing = loading;
        this.logger.debug('this.memberForm', this.memberForm, loading);
        if (!loading) {
          this.memberForm?.hide();
          this.store.dispatch(listLoad());
        }
      })
    );
    this.subscriptions.add(
      this.store.select(saveLoading).subscribe((loading) => {
        this.listProcessing = loading;
        if (!loading) {
          this.store.dispatch(listLoad());
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
    if (this.listProcessing) {
      return;
    }
    this.logger.debug("delete", member);
    if (confirm(`Are you sure you want to delete '${member.firstName} ${member.lastName}'`)) {
      this.store.dispatch(remove({ id: member.id }));
    }
  }

  onSortModeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.dispatch(listSort({ sortMode: value }));
  }

  onSearch(query: string) {
    this.logger.debug('search', query);
    this.store.dispatch(listSearch({ query }));
  }

  onPageChange(page: number) {
    const pageNumber = page - 1;
    this.store.dispatch(listNavigate({ offset: pageNumber * this.pageSize, first: this.pageSize }));
  }

  onFormShown() {
    this.memberFormMode = "Cancel"
  }

  onFormHidden() {
    this.memberFormMode = "New"
  }
}
