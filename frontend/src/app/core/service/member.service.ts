import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { Apollo } from 'apollo-angular';
import { from, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberPage } from '../model/member-page.model';
import { Member } from '../model/member.model';
import { LIST_MEMBERS, CREATE_MEMBER, UPDATE_MEMBER, DELETE_MEMBER } from '../config/graphql.queries';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(
    private logger: NGXLogger,
    private apollo: Apollo,
    private httpClient: HttpClient) {
  }

  getMembers(variables?: { first?: number, offset?: number, query?: string, orderBy?: string }): Observable<MemberPage> {
    this.logger.debug("getting members", variables);
    return this.apollo.query({
      query: LIST_MEMBERS,
      variables
    }).pipe(
      map((result: any) => result?.data?.members),
      map(({ nodes, totalCount }) => new MemberPage(nodes, totalCount)),
    );
  }

  saveMember(member: Member) {
    if (member.id) {
      return this.updateMember(member);
    } else {
      return this.createMember(member);
    }
  }

  deleteMember(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_MEMBER,
      variables: { id }
    }).pipe(
      map((result: any) => {
        this.logger.debug("deleteMember", result);
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

  resetCache() {
    return from(this.apollo.client.resetStore());
  }

  private createMember(member: Member) {
    return this.apollo.mutate({
      mutation: CREATE_MEMBER,
      variables: { ...member, carModelId: member.carModel?.id }
    }).pipe(
      map((result: any) => {
        this.logger.debug("createMember", result);
        return this.responseHandler(result);
      }));
  }

  private updateMember(member: Member) {
    return this.apollo.mutate({
      mutation: UPDATE_MEMBER,
      variables: { ...member, carModelId: member.carModel?.id }
    }).pipe(
      map((result: any) => {
        this.logger.debug("updateMember", result);
        return this.responseHandler(result);
      }));
  }

  private responseHandler(result: any) {
    if (result.error) {
      return throwError(result.error);
    }
    return of(result?.data);
  }
}
