import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { agent } from 'supertest';
import { MemberInput } from '../schema/types';
import { MemberService } from '../service/member.service';

@Resolver('MemberPage')
export class MembersResolver {

    constructor(
        private readonly memberService: MemberService) { }

    @Query('members')
    async listMembers(
        @Args('first') first: number,
        @Args('offset') offset: number,
        @Args('query') query: string = "*",
        @Args('orderBy') orderBy: string = "NATURAL") {
        return this.memberService.list({ first, offset, query, orderBy });
    }

    @Query('membersByCarAgeMoreThan')
    async membersByCarAgeMoreThan(
        @Args('age') age: number) {
        return this.memberService.membersByCarAgeMoreThan(age);
    }

    @Query('membersByCarAgeLessThan')
    async membersByCarAgeLessThan(
        @Args('age') age: number) {
        return this.memberService.membersByCarAgeLessThan(age);
    }

    @Query('memberByName')
    async membersByName(
        @Args('firstName') firstName: string,
        @Args('lastName') lastName: string,
        @Args('vin') vin: string) {
        return this.memberService.getByName(firstName, lastName, vin);
    }

    @Mutation('createMember')
    async createMember(
        @Args('memberInput') memberInput: MemberInput) {
        return this.memberService.create({ ...memberInput });
    }

    @Mutation('updateMember')
    async updateMember(
        @Args('memberInput') memberInput: MemberInput) {
        return this.memberService.update({ ...memberInput });
    }

    @Mutation('deleteMember')
    async deleteMember(
        @Args('id') id: number) {
        return this.memberService.delete(id);
    }
}