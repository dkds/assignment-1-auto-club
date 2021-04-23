import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Observable, Subscription } from 'rxjs';
import { Member } from '../../../core/model/member.model';
import { SortMode } from '../../../core/model/sort-mode.enum';
import { listLoad, listNavigate, remove, listSort, listSearch } from '../../../core/state/member/member.actions';
import { MemberFormComponent } from '../member-form/member-form.component';

@Component({
  selector: 'member-main',
  templateUrl: './member-main.component.html',
  styleUrls: ['./member-main.component.css']
})
export class MemberComponent implements OnInit, OnDestroy {

  @ViewChild("memberFormContainer") memberForm!: MemberFormComponent;

  subscriptions: Subscription = new Subscription();
  memberList: Observable<Member[]> = this.store.select((state: any) => state.member.list.members);
  totalMemberSize: Observable<number> = this.store.select((state: any) => state.member.list.totalCount);
  sortModes: { name: string, text: SortMode }[] = Object.entries(SortMode).map(([name, text]) => ({ name, text }));

  memberFormMode: string = "New";
  pageSize = 5;
  listProcessing = false;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(listLoad());

    this.subscriptions.add(
      this.store.select((state: any) => state.member.remove.loading).subscribe((loading) => {
        this.listProcessing = loading;
        console.log('this.memberForm', this.memberForm, loading);
        if (!loading) {
          this.memberForm?.hide();
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
    console.log("delete", member);
    if (confirm(`Are you sure you want to delete '${member.firstName} ${member.lastName}'`)) {
      this.store.dispatch(remove({ id: member.id }));
    }
  }

  onSortModeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.dispatch(listSort({ sortMode: value }));
  }

  onSearch(query: string) {
    console.log('search', query);
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
