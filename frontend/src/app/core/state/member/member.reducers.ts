import { on } from '@ngrx/store';
import { createImmerReducer } from 'ngrx-immer/store';
import { listSort, listNavigate, listLoadSuccess, listLoadError, remove, removeSuccess, removeError, importListRequest, importListRequestSuccess, importListRequestError, save, saveError, saveSuccess, exportListRequest, exportListRequestError, exportListRequestSuccess, getExportCriteriaListSuccess, getExportCriteriaListError, listSearch, importListRequestCompleted, importListRequestListenerStarted, importListRequestListenerEnded, exportListRequestCompleted, exportListRequestListenerEnded, exportListRequestListenerStarted } from './member.actions';
import { MemberExportState, MemberImportState, MemberListState, MemberRemoveState, MemberSaveState } from './member.state';

export const initialMemberListState: MemberListState = {
    first: 10,
    offset: 0,
    orderBy: "NATURAL",
    searchQuery: '',
    totalCount: 0,
    members: [],
    error: null,
    loading: false
};

export const initialMemberImportState: MemberImportState = {
    jobs: [],
    fileSource: null,
    error: null,
    loading: false,
};

export const initialMemberExportState: MemberExportState = {
    jobs: [],
    criterias: [],
    criteria: null,
    variables: null,
    error: null,
    loading: false,
};

export const initialMemberRemoveState: MemberRemoveState = {
    id: null,
    error: null,
    loading: false,
};

export const initialMemberSaveState: MemberSaveState = {
    member: null,
    error: null,
    loading: false,
};

export const memberListReducer = createImmerReducer(
    initialMemberListState,
    // list
    on(listSearch, (state, { query }) => {
        state.searchQuery = `${query}`;
        state.loading = true;
        return state;
    }),
    on(listSort, (state, { sortMode }) => {
        state.orderBy = `${sortMode}`;
        state.loading = true;
        return state;
    }),
    on(listNavigate, (state, { offset, first }) => {
        state.first = first;
        state.offset = offset;
        state.loading = true;
        return state;
    }),
    on(listLoadSuccess, (state, { members, totalCount }) => {
        state.members = members;
        state.totalCount = totalCount;
        state.loading = false;
        return state;
    }),
    on(listLoadError, (state, { error }) => {
        state.error = error;
        state.loading = false;
        return state;
    }),
);

export const memberImportReducer = createImmerReducer(
    initialMemberImportState,
    on(importListRequest, (state, { fileSource }) => {
        state.fileSource = fileSource;
        state.loading = true;
        return state;
    }),
    on(importListRequestSuccess, (state, { jobId }) => {
        state.jobs = [...state.jobs, { jobId, listening: false }];
        state.fileSource = null;
        state.loading = false;
        return state;
    }),
    on(importListRequestError, (state, { error }) => {
        state.error = error;
        state.loading = false;
        return state;
    }),
    on(importListRequestListenerStarted, (state, { jobId }) => {
        state.jobs = [...state.jobs.filter(job => job.jobId != jobId), { jobId, listening: true }];
        return state;
    }),
    on(importListRequestListenerEnded, (state) => {
        state.jobs = state.jobs.map(job => { job.listening = false; return job; });
        return state;
    }),
    on(importListRequestCompleted, (state, { jobId }) => {
        state.jobs = state.jobs.filter(job => job.jobId != jobId);
        return state;
    }),
);

export const memberExportReducer = createImmerReducer(
    initialMemberExportState,
    on(exportListRequest, (state, { criteria, variables }) => {
        state.criteria = criteria;
        state.variables = variables;
        state.loading = true;
        return state;
    }),
    on(exportListRequestSuccess, (state, { jobId }) => {
        state.jobs = [...state.jobs, { jobId, listening: false }];
        state.criteria = null;
        state.variables = null;
        state.loading = false;
        return state;
    }),
    on(exportListRequestError, (state, { error }) => {
        state.error = error;
        state.criteria = null;
        state.variables = null;
        state.loading = false;
        return state;
    }),
    on(exportListRequestListenerStarted, (state, { jobId }) => {
        state.jobs = [...state.jobs.filter(job => job.jobId != jobId), { jobId, listening: true }];
        return state;
    }),
    on(exportListRequestListenerEnded, (state) => {
        state.jobs = state.jobs.map(job => { job.listening = false; return job; });
        return state;
    }),
    on(exportListRequestCompleted, (state, { jobId }) => {
        state.jobs = state.jobs.filter(job => job.jobId != jobId);
        state.criteria = null;
        state.variables = null;
        state.loading = false;
        return state;
    }),
    on(getExportCriteriaListSuccess, (state, { criterias }) => {
        state.criterias = criterias;
        state.loading = false;
        return state;
    }),
    on(getExportCriteriaListError, (state, { error }) => {
        state.error = error;
        state.loading = false;
        return state;
    }),
);

export const memberSaveReducer = createImmerReducer(
    initialMemberSaveState,
    on(save, (state, { member }) => {
        state.member = member;
        state.loading = true;
        return state;
    }),
    on(saveSuccess, (state) => {
        state.member = null;
        state.loading = false;
        return state;
    }),
    on(saveError, (state, { error }) => {
        state.member = null;
        state.error = error;
        state.loading = false;
        return state;
    }),
);

export const memberRemoveReducer = createImmerReducer(
    initialMemberRemoveState,
    on(remove, (state, { id }) => {
        state.id = id;
        state.loading = true;
        return state;
    }),
    on(removeSuccess, (state) => {
        state.id = null;
        state.loading = false;
        return state;
    }),
    on(removeError, (state, { error }) => {
        state.error = error;
        state.loading = false;
        return state;
    }),
);
