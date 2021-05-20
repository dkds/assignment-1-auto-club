import { createSelector } from '@ngrx/store';
import { MemberExportState, MemberImportState, MemberListState, MemberRemoveState, MemberSaveState } from './member.state';

export const selectMemberList = (state: any) => state.member.list;
export const selectMemberSave = (state: any) => state.member.save;
export const selectMemberRemove = (state: any) => state.member.remove;
export const selectMemberImport = (state: any) => state.member.import;
export const selectMemberExport = (state: any) => state.member.export;

export const listMembers = createSelector(
  selectMemberList,
  (state: MemberListState) => state.members
);
export const listTotalCount = createSelector(
  selectMemberList,
  (state: MemberListState) => state.totalCount
);
export const removeLoading = createSelector(
  selectMemberRemove,
  (state: MemberRemoveState) => state.loading
);
export const saveLoading = createSelector(
  selectMemberSave,
  (state: MemberSaveState) => state.loading
);
export const importLoading = createSelector(
  selectMemberImport,
  (state: MemberImportState) => state.loading
);
export const importJobs = createSelector(
  selectMemberImport,
  (state: MemberImportState) => state.jobs
);
export const exportLoading = createSelector(
  selectMemberExport,
  (state: MemberExportState) => state.loading
);
export const exportJobs = createSelector(
  selectMemberExport,
  (state: MemberExportState) => state.jobs
);
export const exportCriterias = createSelector(
  selectMemberExport,
  (state: MemberExportState) => state.criterias
);
