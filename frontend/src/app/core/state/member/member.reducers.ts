import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { on } from '@ngrx/store';
import { createImmerReducer } from 'ngrx-immer/store';
import { listSort, listNavigate, listLoadSuccess, listLoadError, remove, removeSuccess, removeError, importList, importListSuccess, importListError, save, saveError, saveSuccess, exportListRequest, exportListRequestError, exportListRequestSuccess, getExportCriteriaList, getExportCriteriaListSuccess, getExportCriteriaListError, listSearch, exportListSuccess } from './member.actions';
import { MemberExportState, MemberImportState, MemberListState, MemberRemoveState, MemberSaveState } from './member.state';

export const initialMemberListState: MemberListState = {
    first: 5,
    offset: 0,
    orderBy: "NATURAL",
    searchQuery: '',
    totalCount: 0,
    members: [],
    error: null,
    loading: false
};

export const initialMemberImportState: MemberImportState = {
    jobId: null,
    fileSource: null,
    error: null,
    loading: false,
};

export const initialMemberExportState: MemberExportState = {
    jobId: null,
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
    on(importList, (state, { fileSource }) => {
        state.fileSource = fileSource;
        state.loading = true;
        return state;
    }),
    on(importListSuccess, (state, { jobId }) => {
        state.jobId = jobId;
        state.fileSource = null;
        state.loading = false;
        return state;
    }),
    on(importListError, (state, { error }) => {
        state.error = error;
        state.loading = false;
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
        state.jobId = jobId;
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
    on(exportListSuccess, (state) => {
        state.jobId = null;
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
