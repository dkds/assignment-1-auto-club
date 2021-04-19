import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { DateTime } from 'luxon';
import { map, mergeMap, pluck, toArray } from 'rxjs/operators';
import { gql } from '@apollo/client';
import { ApolloService } from './apollo.service';

@Injectable()
export class MemberService {

    constructor(private readonly apolloService: ApolloService) {
    }

    findAll(
        first: number,
        offset: number,
        orderBy: string) {
        const query = this.apolloService.query({
            query: gql`
            query ($first: Int!, $offset: Int!, $orderBy: MembersOrderBy!) {
                allMembers(first: $first, offset: $offset, orderBy: [$orderBy]) {
                    totalCount
                    nodes {
                        id
                        firstName
                        lastName
                        email
                        vin
                        manufacturedDate
                        carModelByCarModelId {
                            name
                            carMakeByCarMakeId {
                                name
                            }
                        }
                    }
                }
            }
            `,
            variables: {
                first,
                offset,
                orderBy
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


    // createMember(member: {
    //     firstName: string,
    //     lastName: string,
    //     email: string,
    //     vinNumber: string,
    //     mfd: string,
    //     carModelId: number
    // }) {
    //     const data = CREATE_MEMBER;
    //     data.variables = member;

    //     return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
    //         .pipe(
    //             pluck('data', 'data'),
    //             map((data: any) => data.createMember.member)
    //         );
    // }

    // getMember(firstName: string, lastName: string, vin: string) {
    //     const data = GET_MEMBER_BY_NAME;
    //     data.variables.firstName = firstName;
    //     data.variables.lastName = lastName;
    //     data.variables.vin = vin;

    //     return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
    //         .pipe(
    //             pluck('data', 'data'),
    //             mergeMap((data: any) => data.allMembers.nodes),
    //             first(),
    //             catchError(error => {
    //                 return of({ error: true, body: error });
    //             })
    //         );
    // }

    // getMembers(variables: any) {
    //     console.log('variables', variables);

    //     const data = GET_MEMBERS;
    //     data.variables = variables;

    //     return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
    //         .pipe(
    //             pluck('data', 'data', 'allMembers', 'nodes'),
    //             catchError(error => {
    //                 return of({ error: true, body: error });
    //             })
    //         );
    // }

    // getMembersByAge(variables: any) {
    //     console.log('variables', variables);

    //     const data = GET_MEMBERS;
    //     data.variables = variables;

    //     return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
    //         .pipe(
    //             pluck('data', 'data', 'allMembers', 'nodes'),
    //             catchError(error => {
    //                 return of({ error: true, body: error });
    //             })
    //         );
    // }
}
