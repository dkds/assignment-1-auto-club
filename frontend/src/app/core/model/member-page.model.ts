import { Member } from "./member.model";

export class MemberPage {

    constructor(
        public members: Member[],
        public totalCount: number = 0
    ) { }
}