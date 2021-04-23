import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { DateTime } from 'luxon';
import { map, mergeMap, pluck, toArray } from 'rxjs/operators';
import { ApolloService } from './apollo.service';
import { CREATE_MEMBER, DELETE_MEMBER, LIST_MEMBERS, UPDATE_MEMBER } from './graphql-queries.schema';
import { MemberInput } from 'src/graphql/schema/types';
import { CarModelService } from './car-model.service';

@Injectable()
export class MemberService {

  constructor(
    private readonly apolloService: ApolloService) {
  }

  list(criteria: {
    first: number,
    offset: number,
    orderBy: string
  }) {
    const query = this.apolloService.query({
      query: LIST_MEMBERS,
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
              map((member: any) => {
                const memberData = {
                  ...member,
                  carModel: member.carModelByCarModelId.name,
                  carMake: member.carModelByCarModelId.carMakeByCarMakeId.name,
                  mfd: DateTime.fromISO(member.manufacturedDate).toISODate()
                };
                delete memberData.nodes;
                delete memberData.manufacturedDate;
                delete memberData.carModelByCarModelId;

                return memberData;
              }),
              toArray(),
              map((members: [any]) => {
                return { totalCount, nodes: members };
              })
            );
        }),
      );
  }

  create(member: MemberInput) {
    const mutation = this.apolloService.mutate({
      mutation: CREATE_MEMBER,
      variables: {
        ...member,
        carModelId: member.carModel.id
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data'),
        map((data: any) => data.createMember.member),
        map((member: any) => {
          const memberData = {
            ...member,
            carModel: member.carModelByCarModelId.name,
            carMake: member.carModelByCarModelId.carMakeByCarMakeId.name,
            mfd: DateTime.fromISO(member.manufacturedDate).toISODate()
          };
          delete memberData.nodes;
          delete memberData.manufacturedDate;
          delete memberData.carModelByCarModelId;

          return memberData;
        })
      );
  }

  update(member: MemberInput) {
    const mutation = this.apolloService.mutate({
      mutation: UPDATE_MEMBER,
      variables: {
        ...member,
        carModelId: member.carModel.id
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data'),
        map((data: any) => data.updateMemberById.member),
        map((member: any) => {
          const memberData = {
            ...member,
            carModel: member.carModelByCarModelId.name,
            carMake: member.carModelByCarModelId.carMakeByCarMakeId.name,
            mfd: DateTime.fromISO(member.manufacturedDate).toISODate()
          };
          delete memberData.nodes;
          delete memberData.manufacturedDate;
          delete memberData.carModelByCarModelId;

          return memberData;
        })
      );
  }

  delete(id: number) {
    const mutation = this.apolloService.mutate({
      mutation: DELETE_MEMBER,
      variables: {
        id
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data'),
        map((data: any) => data.deleteMemberById.deletedMemberId)
      );
  }
}
