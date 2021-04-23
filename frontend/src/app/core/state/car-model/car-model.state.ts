import { CarModel } from "../../model/car-model.model";

export interface CarModelListState {
    carModels: CarModel[];
    error: string | null;
    loading: boolean;
}

export interface CarModelRemoveState {
    id: number | null,
    error: string | null,
    loading: boolean,
}

export interface CarModelSaveState {
    carModel: CarModel | null,
    error: string | null,
    loading: boolean,
}
