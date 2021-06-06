import { on } from '@ngrx/store';
import { createImmerReducer } from 'ngrx-immer/store';
import { CarModelActions } from './car-model.actions';
import { CarModelListState, CarModelRemoveState, CarModelSaveState } from './car-model.state';

const initialCarModelListState: CarModelListState = {
  carModels: [],
  requestState: 'idle',
  requestError: null,
};

const initialCarModelSaveState: CarModelSaveState = {
  carModel: null,
  requestState: 'idle',
  requestError: null,
};

const initialCarModelRemoveState: CarModelRemoveState = {
  id: null,
  requestState: 'idle',
  requestError: null,
};

const carModelListReducer = createImmerReducer(
  initialCarModelListState,
  // list
  on(CarModelActions.listLoad, (state) => {
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(CarModelActions.listLoadSuccess, (state, { carModels }) => {
    state.carModels = carModels;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(CarModelActions.listLoadError, (state, { error }) => {
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

const carModelSaveReducer = createImmerReducer(
  initialCarModelSaveState,
  // save
  on(CarModelActions.save, (state, { carModel }) => {
    state.carModel = carModel;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(CarModelActions.saveSuccess, (state) => {
    state.carModel = null;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(CarModelActions.saveError, (state, { error }) => {
    state.carModel = null;
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

const carModelRemoveReducer = createImmerReducer(
  initialCarModelRemoveState,
  // remove
  on(CarModelActions.remove, (state, { carModel }) => {
    state.id = carModel.id;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(CarModelActions.removeSuccess, (state) => {
    state.id = null;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(CarModelActions.removeError, (state, { error }) => {
    state.id = null;
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

export const carModelInitialState = {
  list: initialCarModelListState,
  save: initialCarModelSaveState,
  remove: initialCarModelRemoveState,
}
export const carModelReducers = {
  list: carModelListReducer,
  save: carModelSaveReducer,
  remove: carModelRemoveReducer,
}