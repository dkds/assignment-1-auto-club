import { ParseIntPipe } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { mergeMap, pluck } from 'rxjs/operators';
import { CarMakeService } from 'src/core/service/car-make.service';
import { CarModelService } from 'src/core/service/car-model.service';
import { MemberService } from 'src/core/service/member.service';

const pubSub = new PubSub();

@Resolver('MemberPage')
export class MembersResolver {

    constructor(
        private readonly memberService: MemberService) { }

    @Query('members')
    async listMembers(
        @Args('first') first: number,
        @Args('offset') offset: number,
        @Args('orderBy') orderBy: string) {
        return this.memberService.findAll(first, offset, orderBy);
    }

    // @Query('membersByRegex')
    // async getMembersByRegex() {
    //     return this.memberService.findAll();
    // }

    // @ResolveField()
    // async carModel(@Parent() member) {
    //     const { carModelId } = member;
    //     return this.carModelService.getCarModelById(carModelId)
    //         .pipe(
    //             pluck('name')
    //         );
    // }

    // @ResolveField()
    // async carMake(@Parent() member) {
    //     const { carModelId } = member;
    //     return this.carModelService.getCarModelById(carModelId)
    //         .pipe(
    //             mergeMap((carModel) => this.carMakeService.getCarMakeById(carModel.carMakeId)),
    //             pluck('name'),
    //         );
    // }
}