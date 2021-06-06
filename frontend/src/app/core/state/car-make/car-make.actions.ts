import { createAction, props } from '@ngrx/store';
import { CarMake } from '../../model/car-make.model';

export class CarMakeActions {



  static listLoad = createAction(
    '[Car Make List/API] Load'
  );

  static listLoadSuccess = createAction(
    '[Car Make List/API] Load Success',
    props<{ carMakes: CarMake[] }>()
  );

  static listLoadError = createAction(
    '[Car Make List/API] Load Error',
    props<{ error: string }>()
  );



  static remove = createAction(
    '[Car Make Delete/API] Delete',
    props<{ carMake: CarMake }>()
  );

  static removeSuccess = createAction(
    '[Car Make Delete/API] Delete Success'
  );

  static removeError = createAction(
    '[Car Make Delete/API] Delete Error',
    props<{ error: string }>()
  );



  static save = createAction(
    '[Car Make Save/API] Save',
    props<{ carMake: CarMake }>()
  );

  static saveSuccess = createAction(
    '[Car Make Save/API] Save Success'
  );

  static saveError = createAction(
    '[Car Make Save/API] Save Error',
    props<{ error: string }>()
  );
}

