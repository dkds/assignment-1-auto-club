import { createAction, props } from '@ngrx/store';
import { Member } from '../../model/member.model';

export const listSearch = createAction(
    '[Member List/API] Search',
    props<{ query: string }>()
);

export const listNavigate = createAction(
    '[Member List/API] Navigate',
    props<{ first: number, offset: number }>()
);

export const listSort = createAction(
    '[Member List/API] Sort',
    props<{ sortMode: String }>()
);

export const listLoad = createAction(
    '[Member List/API] Load'
);

export const listLoadSuccess = createAction(
    '[Member List/API] Load Success',
    props<{ members: Member[], totalCount: number }>()
);

export const listLoadError = createAction(
    '[Member List/API] Load Error',
    props<{ error: string }>()
);

export const remove = createAction(
    '[Member Delete/API] Delete',
    props<{ id: number }>()
);

export const removeSuccess = createAction(
    '[Member Delete/API] Delete Success'
);

export const removeError = createAction(
    '[Member Delete/API] Delete Error',
    props<{ error: string }>()
);

export const importListRequest = createAction(
    '[Member List Import/API] Import Request',
    props<{ fileSource: File }>()
);

export const importListRequestSuccess = createAction(
    '[Member List Import/API] Import Request Success',
    props<{ jobId: string }>()
);

export const importListRequestError = createAction(
    '[Member List Import/API] Import Request Error',
    props<{ error: string }>()
);

export const importListRequestListenerStarted = createAction(
    '[Member List Import/API] Import Listener Started',
    props<{ jobId: string }>()
);

export const importListRequestListenerEnded = createAction(
    '[Member List Import/API] Import Listener Ended'
);

export const importListRequestCompleted = createAction(
    '[Member List Import/API] Import Completed',
    props<{ jobId: string }>()
);

export const getExportCriteriaList = createAction(
    '[Export Criterias/API] Criterias List'
);

export const getExportCriteriaListSuccess = createAction(
    '[Export Criterias/API] Criterias List Success',
    props<{ criterias: any[] }>()
);
export const getExportCriteriaListError = createAction(
    '[Export Criterias/API] Criterias List Error',
    props<{ error: string }>()
);

export const exportListRequest = createAction(
    '[Member List Export/API] Export Request',
    props<{ criteria: string, variables?: any }>()
);

export const exportListRequestSuccess = createAction(
    '[Member List Export/API] Export Request Success',
    props<{ jobId: string }>()
);

export const exportListRequestError = createAction(
    '[Member List Export/API] Export Request Error',
    props<{ error: string }>()
);

export const exportListRequestListenerStarted = createAction(
    '[Member List Export/API] Export Listener Started',
    props<{ jobId: string }>()
);

export const exportListRequestListenerEnded = createAction(
    '[Member List Export/API] Export Listener Ended'
);

export const exportListRequestCompleted = createAction(
    '[Member List Export/API] Export Completed',
    props<{ jobId: string }>()
);

export const save = createAction(
    '[Member Save/API] Save',
    props<{ member: Member }>()
);

export const saveSuccess = createAction(
    '[Member Save/API] Save Success'
);

export const saveError = createAction(
    '[Member Save/API] Save Error',
    props<{ error: string }>()
);
