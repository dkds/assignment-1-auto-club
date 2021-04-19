import { createReducer, on } from '@ngrx/store';

import { sort, navigate } from '../actions/member.actions';

export const initialState: { first: number, offset: number, orderBy: string } = { first: 5, offset: 0, orderBy: "NATURAL" };

export const membersReducer = createReducer(
    initialState,
    on(sort, (state, { sortMode }) => ({ ...state, orderBy: `${sortMode}` })),
    on(navigate, (state, { offset, first }) => ({ ...state, offset, first })),
);
