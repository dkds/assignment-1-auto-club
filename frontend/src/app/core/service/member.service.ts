import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, EMPTY, Observable, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberPage } from '../model/member-page.model';
import { Member } from '../model/member.model';
import { LIST_MEMBERS, CREATE_MEMBER, UPDATE_MEMBER, DELETE_MEMBER } from './graphql.schema';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private memberSubject: Subject<MemberPage> = new BehaviorSubject(new MemberPage([], 0));
  private listQuery: QueryRef<any, { first: number, offset: number, orderBy: string }> =
    this.apollo.watchQuery({ query: LIST_MEMBERS, variables: { first: 5, offset: 0, orderBy: "NATURAL" } });

  constructor(
    private apollo: Apollo,
    private httpClient: HttpClient) {
  }

  loadMemberList() {
    this.listQuery.valueChanges.subscribe((result: any) => {
      console.log("initData", result);

      const total = result?.data?.members?.totalCount;
      const members = result?.data?.members?.nodes;

      this.memberSubject.next(new MemberPage(members, total));
    });
  }

  refresh(variables?: any) {
    return this.listQuery.refetch(variables);
  }

  getMembers(): Observable<MemberPage> {
    return this.memberSubject.asObservable();
  }

  saveMember(member: Member) {
    if (member.id) {
      return this.updateMember(member);
    } else {
      return this.createMember(member);
    }
  }

  deleteMember(member: Member) {
    return this.apollo.mutate({
      mutation: DELETE_MEMBER,
      variables: member
    }).pipe(map((result: any) => {
      console.log("deleteMember", result);
      return this.responseHandler(result);
    }));
  }

  exportCriterias(): Observable<any> {
    return this.httpClient.get(`${environment.apiHost}/export/criteria`);
  }

  requestExport(criteria: string, variables: any): Observable<any> {
    return this.httpClient.post(`${environment.apiHost}/export/request`, { criteria, variables });
  }

  importFile(formData: FormData): Observable<any> {
    return this.httpClient.post(`${environment.apiHost}/import`, formData);
  }

  private createMember(member: Member) {
    return this.apollo.mutate({
      mutation: CREATE_MEMBER,
      variables: { ...member, carModelId: member.carModel?.id }
    }).pipe(map((result: any) => {
      console.log("createMember", result);
      return this.responseHandler(result);
    }));
  }

  private updateMember(member: Member) {
    return this.apollo.mutate({
      mutation: UPDATE_MEMBER,
      variables: { ...member, carModelId: member.carModel?.id }
    }).pipe(map((result: any) => {
      console.log("updateMember", result);
      return this.responseHandler(result);
    }));
  }

  private responseHandler(result: any) {
    if (result.error) {
      return throwError(result.error);
    }
    this.refresh();
    return EMPTY;
  }
}
