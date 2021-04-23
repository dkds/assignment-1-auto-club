import { Member } from "../../model/member.model";

export interface MemberListState {
    first: number;
    offset: number;
    orderBy: string;
    searchQuery: string;
    totalCount: number;
    members: Member[];
    error: string | null;
    loading: boolean;
}

export interface MemberImportState {
    jobId: string | null;
    fileSource: string | null;
    error: string | null;
    loading: boolean;
}

export interface MemberExportState {
    jobId: string | null;
    criterias: any[];
    criteria: string | null;
    variables: any | null;
    error: string | null;
    loading: boolean;
}

export interface MemberSaveState {
    member: Member | null;
    error: string | null;
    loading: boolean;
}

export interface MemberRemoveState {
    id: number | null;
    error: string | null;
    loading: boolean;
}