import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MemberExportState, MemberImportState, MemberListState, MemberRemoveState, MemberSaveState } from './member.state';

export class MemberSelectors {

  private static selectCarModel = createFeatureSelector('member');

  private static selectMemberList = createSelector(MemberSelectors.selectCarModel, (state: any) => state['list']);
  private static selectMemberSave = createSelector(MemberSelectors.selectCarModel, (state: any) => state['save']);
  private static selectMemberRemove = createSelector(MemberSelectors.selectCarModel, (state: any) => state['remove']);
  private static selectMemberImport = createSelector(MemberSelectors.selectCarModel, (state: any) => state['import']);
  private static selectMemberExport = createSelector(MemberSelectors.selectCarModel, (state: any) => state['export']);


  static listMembers = createSelector(
    MemberSelectors.selectMemberList,
    (state: MemberListState) => state.members
  );
  static listMembersVariables = createSelector(
    MemberSelectors.selectMemberList,
    (state: MemberListState) => ({
      first: state.pageSize,
      offset: (state.currentPage - 1) * state.pageSize,
      orderBy: state.sortMode,
      query: state.searchQuery,
    })
  );
  static listPageInfo = createSelector(
    MemberSelectors.selectMemberList,
    (state: MemberListState) => ({
      pageSize: state.pageSize,
      totalCount: state.totalCount,
      currentPage: state.currentPage
    })
  );


  static removeLoading = createSelector(
    MemberSelectors.selectMemberRemove,
    (state: MemberRemoveState) => state.requestState == 'loading'
  );
  static saveLoading = createSelector(
    MemberSelectors.selectMemberSave,
    (state: MemberSaveState) => state.requestState == 'loading'
  );


  static importLoading = createSelector(
    MemberSelectors.selectMemberImport,
    (state: MemberImportState) => state.requestState == 'loading'
  );
  static importJobs = createSelector(
    MemberSelectors.selectMemberImport,
    (state: MemberImportState) => state.jobs
  );


  static exportLoading = createSelector(
    MemberSelectors.selectMemberExport,
    (state: MemberExportState) => state.requestState == 'loading'
  );
  static exportJobs = createSelector(
    MemberSelectors.selectMemberExport,
    (state: MemberExportState) => state.jobs
  );
  static exportCriterias = createSelector(
    MemberSelectors.selectMemberExport,
    (state: MemberExportState) => state.criterias
  );


  static changeError = createSelector(
    MemberSelectors.selectMemberSave,
    MemberSelectors.selectMemberRemove,
    (saveState: MemberSaveState, removeState: MemberRemoveState) => (
      saveState.requestState == 'failed' ? saveState.requestError : false ||
        removeState.requestState == 'failed' ? removeState.requestError : false
    )
  );
  static changeFinished = createSelector(
    MemberSelectors.selectMemberSave,
    MemberSelectors.selectMemberRemove,
    (saveState: MemberSaveState, removeState: MemberRemoveState) => (
      saveState.requestState == 'succeeded' ||
      saveState.requestState == 'failed' ||
      removeState.requestState == 'succeeded' ||
      removeState.requestState == 'failed'
    )
  );
}