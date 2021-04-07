import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { navigate, sort } from 'src/app/state/actions/member.actions';
import { MemberForm } from '../../model/member-form.model';
import { MemberPage } from '../../model/member-page.model';
import { Member } from '../../model/member.model';
import { SortMode } from '../../model/sort-mode.enum';
import { MemberService } from '../../service/member.service';
import { MemberFormComponent } from '../member-form/member-form.component';

@Component({
  selector: 'member-main',
  templateUrl: './member-main.component.html',
  styleUrls: ['./member-main.component.css']
})
export class MemberComponent implements OnInit, OnDestroy {

  @ViewChild("memberFormContainer") memberForm!: MemberFormComponent;

  subscriptions: Subscription = new Subscription();
  memberList: Member[] = [];
  sortModes: { name: string, text: SortMode }[] = Object.entries(SortMode).map(([name, text]) => ({ name, text }));
  memberFormMode: string = "New";
  page = 1;
  pageSize = 5;
  totalMemberSize = 0;
  listProcessing = false;

  constructor(
    private memberService: MemberService,
    private store: Store) { }

  ngOnInit(): void {
    this.subscriptions.add(this.memberService.getMembers().subscribe((memberPage: MemberPage) => {
      console.log("loaded models", memberPage);
      this.memberList = memberPage.members;
      this.totalMemberSize = memberPage.totalCount;
    }));
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
      this.listProcessing = true;
      this.subscriptions.add(this.memberService.deleteMember(member).subscribe(() => {
        this.listProcessing = false;
        this.memberForm.hide();
      }));
    }
  }

  onSortModeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.dispatch(sort({ sortMode: value }));
  }

  onPageChange(page: number) {
    const pageNumber = page - 1;
    this.store.dispatch(navigate({ offset: pageNumber * this.pageSize, first: this.pageSize }));
  }

  onFormShown() {
    this.memberFormMode = "Cancel"
  }

  onFormHidden() {
    this.memberFormMode = "New"
  }
}
