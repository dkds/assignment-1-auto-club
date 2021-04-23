import { on } from '@ngrx/store';
import { createImmerReducer } from 'ngrx-immer/store';
import { listLoadError, listLoadSuccess, remove, removeError, removeSuccess, save, saveError, saveSuccess } from './car-model.actions';
import { CarModelListState, CarModelRemoveState, CarModelSaveState } from './car-model.state';

export const initialCarModelListState: CarModelListState = {
    carModels: [],
    error: null,
    loading: false
};

export const initialCarModelRemoveState: CarModelRemoveState = {
    id: null,
    error: null,
    loading: false,
};

export const initialCarModelSaveState: CarModelSaveState = {
    carModel: null,
    error: null,
    loading: false,
};

export const carModelListReducer = createImmerReducer(
    initialCarModelListState,
    // list
    on(listLoadSuccess, (state, { carModels }) => {
        state.carModels = carModels;
        state.loading = false;
        return state;
    }),
    on(listLoadError, (state, { error }) => {
        state.error = error;
        state.loading = false;
        return state;
    }),
);

export const carModelSaveReducer = createImmerReducer(
    initialCarModelSaveState,
    // save
    on(save, (state, { carModel }) => {
        state.carModel = carModel;
        state.loading = true;
        return state;
    }),
    on(saveSuccess, (state) => {
        state.carModel = null;
        state.loading = false;
        return state;
    }),
    on(saveError, (state, { error }) => {
        state.carModel = null;
        state.error = error;
        state.loading = false;
        return state;
    }),
);

export const carModelRemoveReducer = createImmerReducer(
    initialCarModelRemoveState,
    // remove
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
