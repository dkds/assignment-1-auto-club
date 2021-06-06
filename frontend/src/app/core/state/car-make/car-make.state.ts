import { CarMake } from "../../model/car-make.model";

export interface CarMakeListState {
  carMakes: CarMake[];
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}

export interface CarMakeRemoveState {
  id: number | null;
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}

export interface CarMakeSaveState {
  carMake: CarMake | null;
  requestState: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestError: string | null;
}
