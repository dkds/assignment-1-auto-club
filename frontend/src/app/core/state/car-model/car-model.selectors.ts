import { createSelector } from '@ngrx/store';
import { CarModelListState, CarModelRemoveState, CarModelSaveState } from './car-model.state';

export const selectCarModelList = (state: any) => state.carModel.list;
export const selectCarModelSave = (state: any) => state.carModel.save;
export const selectCarModelRemove = (state: any) => state.carModel.remove;

export const listCarModels = createSelector(
  selectCarModelList,
  (state: CarModelListState) => state.carModels
);
export const saveLoading = createSelector(
  selectCarModelSave,
  (state: CarModelSaveState) => state.loading
);
export const removeLoading = createSelector(
  selectCarModelRemove,
  (state: CarModelRemoveState) => state.loading
);
