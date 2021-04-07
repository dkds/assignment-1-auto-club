import { Member } from "./member.model";

export class MemberPage {

    totalCount: number = 0;
    constructor(public members: Member[]) { }
}