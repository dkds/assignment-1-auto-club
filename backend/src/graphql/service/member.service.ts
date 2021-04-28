import { Injectable } from '@nestjs/common';
import { from, of } from 'rxjs';
import { DateTime } from 'luxon';
import { map, mergeMap, pluck, tap, toArray } from 'rxjs/operators';
import { ApolloService } from './apollo.service';
import { CREATE_MEMBER, DELETE_MEMBER, GET_MEMBER_BY_NAME, LIST_MEMBERS, MEMBERS_BY_CAR_NEWER_THAN, MEMBERS_BY_CAR_OLDER_THAN, SEARCH_MEMBERS, UPDATE_MEMBER } from './graphql-queries.schema';
import { MemberInput } from 'src/graphql/schema/types';

@Injectable()
export class MemberService {

  constructor(
    private readonly apolloService: ApolloService) {
  }

  list(criteria: {
    first: number,
    offset: number,
    query: string,
    orderBy: string
  }) {
    const listCriteria = this.convertSearchQuery(criteria);
    if (listCriteria.query != '%%') {
      return this.search(listCriteria);
    }
    delete listCriteria.query;
    const query = this.apolloService.query({
      query: LIST_MEMBERS,
      variables: {
        ...listCriteria
      }
    });
    return from(query)
      .pipe(
        pluck('data', 'allMembers'),
        mergeMap((memberPage: any) => {
          const totalCount = memberPage.totalCount;
          return from(memberPage.nodes)
            .pipe(
              map(this.mapMemberView()),
              toArray(),
              map((members: [any]) => {
                return { totalCount, nodes: members };
              })
            );
        }),
      );
  }

  search(criteria: {
    first: number,
    offset: number,
    query: string,
    orderBy: string
  }) {
    const query = this.apolloService.query({
      query: SEARCH_MEMBERS,
      variables: {
        ...criteria
      }
    });
    return from(query)
      .pipe(
        pluck('data', 'allMembers'),
        mergeMap((memberPage: any) => {
          const totalCount = memberPage.totalCount;
          return from(memberPage.nodes)
            .pipe(
              map(this.mapMemberView()),
              toArray(),
              map((members: [any]) => {
                return { totalCount, nodes: members };
              })
            );
        }),
      );
  }

  membersByCarAgeMoreThan(age: number) {
    const maxDate = DateTime.now().minus({ years: age }).toISODate();
    const query = this.apolloService.query({
      query: MEMBERS_BY_CAR_OLDER_THAN,
      variables: {
        maxDate
      }
    });
    return from(query)
      .pipe(
        pluck('data', 'allMembers'),
        mergeMap((memberPage: any) => {
          const totalCount = memberPage.totalCount;
          return from(memberPage.nodes)
            .pipe(
              map(this.mapMemberView()),
              toArray(),
              map((members: [any]) => {
                return { totalCount, nodes: members };
              })
            );
        }),
      );
  }

  membersByCarAgeLessThan(age: number) {
    const minDate = DateTime.now().minus({ years: age }).toISODate();
    const query = this.apolloService.query({
      query: MEMBERS_BY_CAR_NEWER_THAN,
      variables: {
        minDate
      }
    });
    return from(query)
      .pipe(
        pluck('data', 'allMembers'),
        mergeMap((memberPage: any) => {
          const totalCount = memberPage.totalCount;
          return from(memberPage.nodes)
            .pipe(
              map(this.mapMemberView()),
              toArray(),
              map((members: [any]) => {
                return { totalCount, nodes: members };
              })
            );
        }),
      );
  }

  getByName(firstName: string, lastName: string, vin: string) {
    const query = this.apolloService.query({
      query: GET_MEMBER_BY_NAME,
      variables: { firstName, lastName, vin }
    });
    return from(query)
      .pipe(
        pluck('data', 'allMembers', 'nodes'),
        mergeMap((data) => data.length > 0
          ? of(data[0]).pipe(map(this.mapMemberView()))
          : of(null)
        ),
      );
  }

  create(member: MemberInput) {
    const mutation = this.apolloService.mutate({
      mutation: CREATE_MEMBER,
      variables: {
        ...member,
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'createMember', 'member'),
        map(this.mapMemberView()),
      );
  }

  update(member: MemberInput) {
    const mutation = this.apolloService.mutate({
      mutation: UPDATE_MEMBER,
      variables: {
        ...member,
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'updateMemberById', 'member'),
        map(this.mapMemberView()),
      );
  }

  delete(id: number) {
    const mutation = this.apolloService.mutate({
      mutation: DELETE_MEMBER,
      variables: { id: +id }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'deleteMemberById', 'deletedMemberId'),
        map((data) => ({ deletedMemberId: +id })),
      );
  }

  private mapMemberView(): (value: any, index: number) => any {
    return (member: any) => {
      const memberData = {
        ...member,
        mfd: DateTime.fromISO(member.manufacturedDate).toISODate(),
        carModel: {
          ...member.carModelByCarModelId,
          carMake: member.carModelByCarModelId.carMakeByCarMakeId,
        },
      };
      delete memberData.nodes;
      delete memberData.manufacturedDate;
      delete memberData.carModelByCarModelId;
      delete memberData.carModel.carMakeByCarMakeId;

      return memberData;
    };
  }

  private convertSearchQuery(criteria:
    { first: number; offset: number; query: string; orderBy: string; }): { first: number; offset: number; query: string; orderBy: string; } {
    if (!criteria.query || !criteria.query.trim().length) {
      return { ...criteria, query: "%%" };
    }
    if (criteria.query == "*") {
      return { ...criteria, query: "%%" };
    }
    if (criteria.query.indexOf('*') > -1) {
      return { ...criteria, query: criteria.query.replace(/\*/g, "%") };
    }
    if (criteria.query.indexOf('?') > -1) {
      return { ...criteria, query: criteria.query.replace(/\?/g, "_") };
    }
    return { ...criteria };
  }

}
