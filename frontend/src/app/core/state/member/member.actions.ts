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

export const importList = createAction(
    '[Member List Import/API] Import',
    props<{ fileSource: File }>()
);

export const importListSuccess = createAction(
    '[Member List Import/API] Import Success',
    props<{ jobId: string }>()
);

export const importListError = createAction(
    '[Member List Import/API] Import Error',
    props<{ error: string }>()
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

export const exportListSuccess = createAction(
    '[Member List Export/API] Export Success'
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
