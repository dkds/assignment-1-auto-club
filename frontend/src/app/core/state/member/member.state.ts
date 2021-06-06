import { Member } from "../../model/member.model";

export interface MemberListState {
  pageSize: number;
  currentPage: number;
  sortMode: string;
  searchQuery: string;
  totalCount: number;
  members: Member[];
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}

export interface MemberImportState {
  jobs: { jobId: string, listening: boolean }[];
  fileSource: File | null;
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}

export interface MemberExportState {
  jobs: { jobId: string, listening: boolean }[];
  criterias: any[];
  criteria: string | null;
  variables: any | null;
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}

export interface MemberSaveState {
  member: Member | null;
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}

export interface MemberRemoveState {
  id: number | null;
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}