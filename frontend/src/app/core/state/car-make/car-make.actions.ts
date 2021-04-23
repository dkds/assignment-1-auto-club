import { createAction, props } from '@ngrx/store';
import { CarMake } from '../../model/car-make.model';

export const listLoad = createAction(
    '[Car Make List/API] Load'
);

export const listReload = createAction(
    '[Car Make List/API] Reload'
);

export const listLoadSuccess = createAction(
    '[Car Make List/API] Load Success',
    props<{ carMakes: CarMake[] }>()
);

export const listLoadError = createAction(
    '[Car Make List/API] Load Error',
    props<{ error: string }>()
);

export const remove = createAction(
    '[Car Make Delete/API] Delete',
    props<{ id: number }>()
);

export const removeSuccess = createAction(
    '[Car Make Delete/API] Delete Success'
);

export const removeError = createAction(
    '[Car Make Delete/API] Delete Error',
    props<{ error: string }>()
);

export const save = createAction(
    '[Car Make Save/API] Save',
    props<{ carMake: CarMake }>()
);

export const saveSuccess = createAction(
    '[Car Make Save/API] Save Success'
);

export const saveError = createAction(
    '[Car Make Save/API] Save Error',
    props<{ error: string }>()
);
