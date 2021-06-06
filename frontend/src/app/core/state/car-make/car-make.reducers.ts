import { on } from '@ngrx/store';
import { createImmerReducer } from 'ngrx-immer/store';
import { CarMakeActions } from './car-make.actions';
import { CarMakeListState, CarMakeRemoveState, CarMakeSaveState } from './car-make.state';


const initialCarMakeListState: CarMakeListState = {
  carMakes: [],
  requestState: 'idle',
  requestError: null,
};
const initialCarMakeSaveState: CarMakeSaveState = {
  carMake: null,
  requestState: 'idle',
  requestError: null,
};
const initialCarMakeRemoveState: CarMakeRemoveState = {
  id: null,
  requestState: 'idle',
  requestError: null,
};


const carMakeListReducer = createImmerReducer(
  initialCarMakeListState,
  // list
  on(CarMakeActions.listLoad, (state) => {
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(CarMakeActions.listLoadSuccess, (state, { carMakes }) => {
    state.carMakes = carMakes;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(CarMakeActions.listLoadError, (state, { error }) => {
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

const carMakeSaveReducer = createImmerReducer(
  initialCarMakeSaveState,
  // save
  on(CarMakeActions.save, (state, { carMake }) => {
    state.carMake = carMake;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(CarMakeActions.saveSuccess, (state) => {
    state.carMake = null;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(CarMakeActions.saveError, (state, { error }) => {
    state.carMake = null;
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

const carMakeRemoveReducer = createImmerReducer(
  initialCarMakeRemoveState,
  // remove
  on(CarMakeActions.remove, (state, { carMake }) => {
    state.id = carMake.id;
    state.requestState = 'loading';
    state.requestError = null;
    return state;
  }),
  on(CarMakeActions.removeSuccess, (state) => {
    state.id = null;
    state.requestState = 'succeeded';
    state.requestError = null;
    return state;
  }),
  on(CarMakeActions.removeError, (state, { error }) => {
    state.id = null;
    state.requestState = 'failed';
    state.requestError = error;
    return state;
  }),
);

export const carMakeInitialState = {
  list: initialCarMakeListState,
  save: initialCarMakeSaveState,
  remove: initialCarMakeRemoveState,
}
export const carMakeReducers = {
  list: carMakeListReducer,
  save: carMakeSaveReducer,
  remove: carMakeRemoveReducer,
}