import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CarModelListState, CarModelRemoveState, CarModelSaveState } from './car-model.state';

export class CarModelSelectors {

  private static selectCarModel = createFeatureSelector('carModel');

  private static selectCarModelList = createSelector(CarModelSelectors.selectCarModel, (state: any) => state['list']);
  private static selectCarModelSave = createSelector(CarModelSelectors.selectCarModel, (state: any) => state['save']);
  private static selectCarModelRemove = createSelector(CarModelSelectors.selectCarModel, (state: any) => state['remove']);


  static listCarModels = createSelector(
    CarModelSelectors.selectCarModelList,
    (state: CarModelListState) => state.carModels
  );


  static saveLoading = createSelector(
    CarModelSelectors.selectCarModelSave,
    (state: CarModelSaveState) => state.requestState == 'loading'
  );
  static removeLoading = createSelector(
    CarModelSelectors.selectCarModelRemove,
    (state: CarModelRemoveState) => state.requestState == 'loading'
  );

  static changeError = createSelector(
    CarModelSelectors.selectCarModelRemove,
    CarModelSelectors.selectCarModelSave,
    (saveState: CarModelSaveState, removeState: CarModelRemoveState) => (
      saveState.requestState == 'failed' ? saveState.requestError : false ||
        removeState.requestState == 'failed' ? removeState.requestError : false
    )
  );
  static changeFinished = createSelector(
    CarModelSelectors.selectCarModelRemove,
    CarModelSelectors.selectCarModelSave,
    (saveState: CarModelSaveState, removeState: CarModelRemoveState) => (
      saveState.requestState == 'succeeded' ||
      saveState.requestState == 'failed' ||
      removeState.requestState == 'succeeded' ||
      removeState.requestState == 'failed'
    )
  );
}