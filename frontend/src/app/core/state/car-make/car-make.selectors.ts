import { createSelector } from '@ngrx/store';
import { CarMakeListState, CarMakeRemoveState, CarMakeSaveState } from './car-make.state';

export const selectCarMakeList = (state: any) => state.carMake.list;
export const selectCarMakeSave = (state: any) => state.carMake.save;
export const selectCarMakeRemove = (state: any) => state.carMake.remove;

export const listCarMakes = createSelector(
  selectCarMakeList,
  (state: CarMakeListState) => state.carMakes
);
export const saveLoading = createSelector(
  selectCarMakeSave,
  (state: CarMakeSaveState) => state.loading
);
export const removeLoading = createSelector(
  selectCarMakeRemove,
  (state: CarMakeRemoveState) => state.loading
);
