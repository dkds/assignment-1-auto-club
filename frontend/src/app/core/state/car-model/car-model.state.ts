import { CarModel } from "../../model/car-model.model";

export interface CarModelListState {
  carModels: CarModel[];
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}

export interface CarModelRemoveState {
  id: number | null,
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}

export interface CarModelSaveState {
  carModel: CarModel | null,
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}
