import { createAction, props } from '@ngrx/store';
import { CarModel } from '../../model/car-model.model';

export class CarModelActions {



  static listLoad = createAction(
    '[Car Model List/API] Load'
  );
  static listLoadSuccess = createAction(
    '[Car Model List/API] Load Success',
    props<{ carModels: CarModel[] }>()
  );
  static listLoadError = createAction(
    '[Car Model List/API] Load Error',
    props<{ error: string }>()
  );



  static remove = createAction(
    '[Car Model Delete/API] Delete',
    props<{ carModel: CarModel }>()
  );
  static removeSuccess = createAction(
    '[Car Model Delete/API] Delete Success'
  );
  static removeError = createAction(
    '[Car Model Delete/API] Delete Error',
    props<{ error: string }>()
  );



  static save = createAction(
    '[Car Model Save/API] Save',
    props<{ carModel: CarModel }>()
  );
  static saveSuccess = createAction(
    '[Car Model Save/API] Save Success'
  );
  static saveError = createAction(
    '[Car Model Save/API] Save Error',
    props<{ error: string }>()
  );
}