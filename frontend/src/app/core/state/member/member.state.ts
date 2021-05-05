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
    jobs: { jobId: string, listening: boolean }[];
    fileSource: File | null;
    error: string | null;
    loading: boolean;
}

export interface MemberExportState {
    jobs: { jobId: string, listening: boolean }[];
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