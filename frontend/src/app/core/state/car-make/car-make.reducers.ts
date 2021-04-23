import { on } from '@ngrx/store';
import { createImmerReducer } from 'ngrx-immer/store';
import { listLoadError, listLoadSuccess, remove, removeError, removeSuccess, save, saveError, saveSuccess } from './car-make.actions';
import { CarMakeListState, CarMakeRemoveState, CarMakeSaveState } from './car-make.state';

export const initialCarMakeListState: CarMakeListState = {
    carMakes: [],
    error: null,
    loading: false
};

export const initialCarMakeRemoveState: CarMakeRemoveState = {
    id: null,
    error: null,
    loading: false,
};

export const initialCarMakeSaveState: CarMakeSaveState = {
    carMake: null,
    error: null,
    loading: false,
};

export const carMakeListReducer = createImmerReducer(
    initialCarMakeListState,
    // list
    on(listLoadSuccess, (state, { carMakes }) => {
        state.carMakes = carMakes;
        state.loading = false;
        return state;
    }),
    on(listLoadError, (state, { error }) => {
        state.error = error;
        state.loading = false;
        return state;
    }),
);

export const carMakeSaveReducer = createImmerReducer(
    initialCarMakeSaveState,
    // save
    on(save, (state, { carMake }) => {
        state.carMake = carMake;
        state.loading = true;
        return state;
    }),
    on(saveSuccess, (state) => {
        state.carMake = null;
        state.loading = false;
        return state;
    }),
    on(saveError, (state, { error }) => {
        state.carMake = null;
        state.error = error;
        state.loading = false;
        return state;
    }),
);

export const carMakeRemoveReducer = createImmerReducer(
    initialCarMakeRemoveState,
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
