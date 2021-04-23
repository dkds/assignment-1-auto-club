import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
        @Args('orderBy') orderBy: string) {
        return this.memberService.list({ first, offset, orderBy });
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