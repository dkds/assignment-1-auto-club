import { createAction, props } from '@ngrx/store';
import { Member } from '../../model/member.model';

export class MemberActions {



  static listSearch = createAction(
    '[Member List/API] Search',
    props<{ query: string }>()
  );
  static listNavigate = createAction(
    '[Member List/API] Navigate',
    props<{ currentPage: number }>()
  );
  static listSort = createAction(
    '[Member List/API] Sort',
    props<{ sortMode: String }>()
  );
  static listLoad = createAction(
    '[Member List/API] Load'
  );
  static listLoadSuccess = createAction(
    '[Member List/API] Load Success',
    props<{ members: Member[], totalCount: number }>()
  );
  static listLoadError = createAction(
    '[Member List/API] Load Error',
    props<{ error: string }>()
  );



  static remove = createAction(
    '[Member Delete/API] Delete',
    props<{ member: Member }>()
  );
  static removeSuccess = createAction(
    '[Member Delete/API] Delete Success'
  );
  static removeError = createAction(
    '[Member Delete/API] Delete Error',
    props<{ error: string }>()
  );



  static importListRequest = createAction(
    '[Member List Import/API] Import Request',
    props<{ fileSource: File }>()
  );
  static importListRequestSuccess = createAction(
    '[Member List Import/API] Import Request Success',
    props<{ jobId: string }>()
  );
  static importListRequestError = createAction(
    '[Member List Import/API] Import Request Error',
    props<{ error: string }>()
  );
  static importListRequestListenerStarted = createAction(
    '[Member List Import/API] Import Listener Started',
    props<{ jobId: string }>()
  );
  static importListRequestListenerEnded = createAction(
    '[Member List Import/API] Import Listener Ended'
  );
  static importListRequestCompleted = createAction(
    '[Member List Import/API] Import Completed',
    props<{ jobId: string }>()
  );



  static getExportCriteriaList = createAction(
    '[Export Criterias/API] Criterias List'
  );
  static getExportCriteriaListSuccess = createAction(
    '[Export Criterias/API] Criterias List Success',
    props<{ criterias: any[] }>()
  );
  static getExportCriteriaListError = createAction(
    '[Export Criterias/API] Criterias List Error',
    props<{ error: string }>()
  );



  static exportListRequest = createAction(
    '[Member List Export/API] Export Request',
    props<{ criteria: string, variables?: any }>()
  );
  static exportListRequestSuccess = createAction(
    '[Member List Export/API] Export Request Success',
    props<{ jobId: string }>()
  );
  static exportListRequestError = createAction(
    '[Member List Export/API] Export Request Error',
    props<{ error: string }>()
  );
  static exportListRequestListenerStarted = createAction(
    '[Member List Export/API] Export Listener Started',
    props<{ jobId: string }>()
  );
  static exportListRequestListenerEnded = createAction(
    '[Member List Export/API] Export Listener Ended'
  );
  static exportListRequestCompleted = createAction(
    '[Member List Export/API] Export Completed',
    props<{ jobId: string }>()
  );



  static save = createAction(
    '[Member Save/API] Save',
    props<{ member: Member }>()
  );
  static saveSuccess = createAction(
    '[Member Save/API] Save Success'
  );
  static saveError = createAction(
    '[Member Save/API] Save Error',
    props<{ error: string }>()
  );
}