import { createAction, props } from '@ngrx/store';
import { CarModel } from '../../model/car-model.model';

export const listLoad = createAction(
    '[Car Model List/API] Load'
);

export const listLoadSuccess = createAction(
    '[Car Model List/API] Load Success',
    props<{ carModels: CarModel[] }>()
);

export const listLoadError = createAction(
    '[Car Model List/API] Load Error',
    props<{ error: string }>()
);

export const remove = createAction(
    '[Car Model Delete/API] Delete',
    props<{ id: number }>()
);

export const removeSuccess = createAction(
    '[Car Model Delete/API] Delete Success'
);

export const removeError = createAction(
    '[Car Model Delete/API] Delete Error',
    props<{ error: string }>()
);

export const save = createAction(
    '[Car Model Save/API] Save',
    props<{ carModel: CarModel }>()
);

export const saveSuccess = createAction(
    '[Car Model Save/API] Save Success'
);

export const saveError = createAction(
    '[Car Model Save/API] Save Error',
    props<{ error: string }>()
);
