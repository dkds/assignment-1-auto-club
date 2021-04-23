import { CarMake } from "../../model/car-make.model";

export interface CarMakeListState {
    carMakes: CarMake[];
    error: string | null;
    loading: boolean;
}

export interface CarMakeRemoveState {
    id: number | null,
    error: string | null,
    loading: boolean,
}

export interface CarMakeSaveState {
    carMake: CarMake | null,
    error: string | null,
    loading: boolean,
}
