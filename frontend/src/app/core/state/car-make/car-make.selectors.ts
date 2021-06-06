import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CarMakeListState, CarMakeRemoveState, CarMakeSaveState } from './car-make.state';

export class CarMakeSelectors {

  private static selectCarMake = createFeatureSelector<CarMakeListState>('carMake');

  private static selectCarMakeList = createSelector(CarMakeSelectors.selectCarMake, (state: any) => state['list']);
  private static selectCarMakeSave = createSelector(CarMakeSelectors.selectCarMake, (state: any) => state['save']);
  private static selectCarMakeRemove = createSelector(CarMakeSelectors.selectCarMake, (state: any) => state['remove']);


  static listCarMakes = createSelector(
    CarMakeSelectors.selectCarMakeList,
    (state: CarMakeListState) => state.carMakes
  );


  static saveLoading = createSelector(
    CarMakeSelectors.selectCarMakeSave,
    (state: CarMakeSaveState) => state.requestState == 'loading'
  );
  static removeLoading = createSelector(
    CarMakeSelectors.selectCarMakeRemove,
    (state: CarMakeRemoveState) => state.requestState == 'loading'
  );


  static changeError = createSelector(
    CarMakeSelectors.selectCarMakeRemove,
    CarMakeSelectors.selectCarMakeSave,
    (saveState: CarMakeSaveState, removeState: CarMakeRemoveState) => (
      saveState.requestState == 'failed' ? saveState.requestError : false ||
        removeState.requestState == 'failed' ? removeState.requestError : false
    )
  );
  static changeFinished = createSelector(
    CarMakeSelectors.selectCarMakeRemove,
    CarMakeSelectors.selectCarMakeSave,
    (saveState: CarMakeSaveState, removeState: CarMakeRemoveState) => (
      saveState.requestState == 'succeeded' ||
      saveState.requestState == 'failed' ||
      removeState.requestState == 'succeeded' ||
      removeState.requestState == 'failed'
    )
  );
}