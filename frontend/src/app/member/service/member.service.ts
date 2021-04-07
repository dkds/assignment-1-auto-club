import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { BehaviorSubject, EMPTY, from, Observable, Subject, Subscription, throwError } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { CarModel } from 'src/app/car-model/model/car-model.model';
import { CarModelService } from 'src/app/car-model/service/car-model.service';
import { MemberPage } from '../model/member-page.model';
import { Member } from '../model/member.model';

const LIST_MEMBERS = gql`
  query ($first: Int!, $offset: Int!, $orderBy: MembersOrderBy!) {
    allMembers(first: $first, offset: $offset, orderBy: [$orderBy]) {
      totalCount
      nodes {
        id
        firstName
        lastName
        email
        vin
        carModelId
        manufacturedDate
      }
    }
  }`;

const CREATE_MEMBER = gql`
  mutation (
    $firstName: String!, 
    $lastName: String!, 
    $email: String!, 
    $vin: String!, 
    $mfd: Datetime!, 
    $carModelId: Int!
  ) {
    createMember(input: {member: {
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email, 
      vin: $vin, 
      manufacturedDate: $mfd, 
      carModelId: $carModelId
    }}) {
      member {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelId
      }
    }
  }`;

const UPDATE_MEMBER = gql`
  mutation (
    $id: Int!,
    $firstName: String!, 
    $lastName: String!, 
    $email: String!, 
    $vin: String!, 
    $mfd: Datetime!, 
    $carModelId: Int!
  ) {
    updateMemberById(input: {id: $id, memberPatch: {
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email, 
      vin: $vin, 
      manufacturedDate: $mfd, 
      carModelId: $carModelId}}) {
      member {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelId
      }
    }
  }`;

const DELETE_MEMBER = gql`
  mutation ($id: Int!) {
    deleteMemberById(input: {id: $id}) {
      deletedMemberId
    }
  }`;

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private members: Member[] = [];
  private memberSubject: Subject<MemberPage> = new BehaviorSubject(new MemberPage(this.members));
  private subscriptions: Subscription = new Subscription();

  private listQuery: QueryRef<any, { first: number, offset: number, orderBy: string }> =
    this.apollo.watchQuery({ query: LIST_MEMBERS, variables: { first: 5, offset: 0, orderBy: "NATURAL" } });

  constructor(
    private apollo: Apollo,
    private httpClient: HttpClient,
    private carModelService: CarModelService,
    private store: Store) {
    this.loadMemberList();
    store.subscribe((state: any) => {
      console.log("state", state);
      this.listQuery.refetch(state?.members);
    });
  }

  private loadMemberList() {
    console.log("getting data");
    this.subscriptions.add(this.listQuery.valueChanges.subscribe((result: any) => {
      console.log("initData", result);
      const total = result?.data?.allMembers?.totalCount;
      from(result?.data?.allMembers?.nodes)
        .pipe(
          mergeMap((data: any) => {
            const member = Member.fromObject(data);
            return this.carModelService.getCarModel(data.carModelId as number)
              .pipe(
                map((carModel: CarModel) => {
                  member.carModel = carModel;
                  return member;
                }));
          }),
          toArray()
        ).subscribe((data: Member[]) => {
          this.members = data;
          const memberPage = new MemberPage(this.members);
          memberPage.totalCount = total;
          console.log(memberPage);
          this.memberSubject.next(memberPage);
        });
    }));
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

  refresh() {
    return this.listQuery.refetch();
  }

  getMembers(): Subject<MemberPage> {
    return this.memberSubject;
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

  uploadFile(formData: FormData): Observable<any> {
    return this.httpClient.post('http://localhost:3000/upload', formData)
  }
}
