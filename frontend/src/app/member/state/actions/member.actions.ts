import { createAction, props } from '@ngrx/store';

export const navigate = createAction(
    '[Member List/API] Navigate',
    props<{ first: number, offset: number }>()
);

export const sort = createAction(
    '[Member List/API] Sort',
    props<{ sortMode: String }>()
);