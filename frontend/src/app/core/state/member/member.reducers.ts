import { on } from '@ngrx/store';
import { createImmerReducer } from 'ngrx-immer/store';
import { MemberActions } from './member.actions';
import { MemberExportState, MemberImportState, MemberListState, MemberRemoveState, MemberSaveState } from './member.state';

const initialMemberListState: MemberListState = {
  pageSize: 10,
  currentPage: 1,
  sortMode: "NATURAL",
  searchQuery: '*',
  totalCount: 0,
  members: [],
  requestState: 'idle',
  requestError: null,
};

const initialMemberImportState: MemberImportState = {
  jobs: [],
  fileSource: null,
  requestState: 'idle',
  requestError: null,
};

const initialMemberExportState: MemberExportState = {
  jobs: [],
  criterias: [],
  criteria: null,
  variables: null,
  requestState: 'idle',
  requestError: null,
}

const initialMemberRemoveState: MemberRemoveState = {
  id: null,
  requestState: 'idle',
  requestError: null,
};

const initialMemberSaveState: MemberSaveState = {
  member: null,
  requestState: 'idle',
  requestError: null,
};

export const memberListReducer = createImmerReducer(
  initialMemberListState,
  // list
  on(MemberActions.listSearch, (state, { query }) => {
    state.searchQuery = `${query}`;
    state.currentPage = initialMemberListState.currentPage;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.listSort, (state, { sortMode }) => {
    state.sortMode = `${sortMode}`;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.listNavigate, (state, { currentPage }) => {
    state.currentPage = currentPage;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.listLoadSuccess, (state, { members, totalCount }) => {
    state.members = members;
    state.totalCount = totalCount;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.listLoadError, (state, { error }) => {
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

export const memberImportReducer = createImmerReducer(
  initialMemberImportState,
  on(MemberActions.importListRequest, (state, { fileSource }) => {
    state.fileSource = fileSource;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.importListRequestSuccess, (state, { jobId }) => {
    state.jobs = [...state.jobs, { jobId, listening: false }];
    state.fileSource = null;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.importListRequestError, (state, { error }) => {
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
  on(MemberActions.importListRequestListenerStarted, (state, { jobId }) => {
    state.jobs = [...state.jobs.filter(job => job.jobId != jobId), { jobId, listening: true }];
    return state;
  }),
  on(MemberActions.importListRequestListenerEnded, (state) => {
    state.jobs = state.jobs.map(job => { job.listening = false; return job; });
    return state;
  }),
  on(MemberActions.importListRequestCompleted, (state, { jobId }) => {
    state.jobs = state.jobs.filter(job => job.jobId != jobId);
    return state;
  }),
);

export const memberExportReducer = createImmerReducer(
  initialMemberExportState,
  on(MemberActions.exportListRequest, (state, { criteria, variables }) => {
    state.criteria = criteria;
    state.variables = variables;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.exportListRequestSuccess, (state, { jobId }) => {
    state.jobs = [...state.jobs, { jobId, listening: false }];
    state.criteria = null;
    state.variables = null;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.exportListRequestError, (state, { error }) => {
    state.criteria = null;
    state.variables = null;
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
  on(MemberActions.exportListRequestListenerStarted, (state, { jobId }) => {
    state.jobs = [...state.jobs.filter(job => job.jobId != jobId), { jobId, listening: true }];
    return state;
  }),
  on(MemberActions.exportListRequestListenerEnded, (state) => {
    state.jobs = state.jobs.map(job => { job.listening = false; return job; });
    return state;
  }),
  on(MemberActions.exportListRequestCompleted, (state, { jobId }) => {
    state.jobs = state.jobs.filter(job => job.jobId != jobId);
    state.criteria = null;
    state.variables = null;
    state.requestState = 'succeeded';
    return state;
  }),
  on(MemberActions.getExportCriteriaListSuccess, (state, { criterias }) => {
    state.criterias = criterias;
    state.requestState = 'succeeded';
    return state;
  }),
  on(MemberActions.getExportCriteriaListError, (state, { error }) => {
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

export const memberSaveReducer = createImmerReducer(
  initialMemberSaveState,
  on(MemberActions.save, (state, { member }) => {
    state.member = member;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.saveSuccess, (state) => {
    state.member = null;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.saveError, (state, { error }) => {
    state.member = null;
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

export const memberRemoveReducer = createImmerReducer(
  initialMemberRemoveState,
  on(MemberActions.remove, (state, { member }) => {
    state.id = member.id;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.removeSuccess, (state) => {
    state.id = null;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(MemberActions.removeError, (state, { error }) => {
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

export const memberReducers = {
  list: memberListReducer,
  save: memberSaveReducer,
  remove: memberRemoveReducer,
  import: memberImportReducer,
  export: memberExportReducer,
}