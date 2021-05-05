import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { of, from } from "rxjs";
import { mergeMap, map, catchError, filter } from "rxjs/operators";
import { MemberService } from "../../service/member.service";
import { getExportCriteriaList, exportListRequest, exportListRequestError, exportListRequestSuccess, importListRequest, importListRequestError, importListRequestSuccess, listLoad, listLoadError, listLoadSuccess, save, saveError, saveSuccess, getExportCriteriaListSuccess, getExportCriteriaListError, listNavigate, listSort, listSearch, remove, removeSuccess, removeError } from "./member.actions";

@Injectable()
export class MemberEffects {

  loadMembers = createEffect(() => this.actions.pipe(
    ofType(listLoad),
    mergeMap(() => from(this.memberService.loadMemberList())
      .pipe(
        mergeMap(() => this.memberService.getMembers()
          .pipe(
            map(memberPage => (listLoadSuccess({ ...memberPage }))),
            catchError(() => of(listLoadError({ error: "member load failed" })))
          )
        )
      )
    )
  ));

  searchList = createEffect(() => this.actions.pipe(
    ofType(listSearch),
    mergeMap(({ query }) => from(this.memberService.loadMemberList({ query }))
      .pipe(
        mergeMap(() => this.memberService.getMembers()
          .pipe(
            map(memberPage => (listLoadSuccess({ ...memberPage }))),
            catchError(() => of(listLoadError({ error: "member load failed" })))
          )
        ))
    )
  ));

  sortList = createEffect(() => this.actions.pipe(
    ofType(listSort),
    mergeMap(({ sortMode }) => from(this.memberService.loadMemberList({ orderBy: sortMode }))
      .pipe(
        mergeMap(() => this.memberService.getMembers()
          .pipe(
            map(memberPage => (listLoadSuccess({ ...memberPage }))),
            catchError(() => of(listLoadError({ error: "member load failed" })))
          )
        ))
    )
  ));

  navigateList = createEffect(() => this.actions.pipe(
    ofType(listNavigate),
    mergeMap(({ first, offset }) => from(this.memberService.loadMemberList({ first, offset }))
      .pipe(
        mergeMap(() => this.memberService.getMembers()
          .pipe(
            map(memberPage => (listLoadSuccess({ ...memberPage }))),
            catchError(() => of(listLoadError({ error: "member load failed" })))
          )
        ))
    )
  ));

  importMembers = createEffect(() => this.actions.pipe(
    ofType(importListRequest),
    mergeMap(({ fileSource }) => {
      const formData = new FormData();
      formData.append("file", fileSource);
      return this.memberService.importFile(formData)
        .pipe(
          map(response => (importListRequestSuccess({ jobId: response.jobId }))),
          catchError(() => of(importListRequestError({ error: "member import failed" })))
        );
    })
  ));

  exportCriterias = createEffect(() => this.actions.pipe(
    ofType(getExportCriteriaList),
    mergeMap(() => {
      return this.memberService.exportCriterias()
        .pipe(
          map(response => getExportCriteriaListSuccess({ criterias: response })),
          catchError(() => of(getExportCriteriaListError({ error: "export criterias failed" })))
        );
    })
  ));

  exportMembersRequest = createEffect(() => this.actions.pipe(
    ofType(exportListRequest),
    mergeMap(({ criteria, variables }) => {
      return this.memberService.requestExport(criteria, variables)
        .pipe(
          map(response => (exportListRequestSuccess({ jobId: response.jobId }))),
          catchError(() => of(exportListRequestError({ error: "member export request failed" })))
        );
    })
  ));

  saveMember = createEffect(() => this.actions.pipe(
    ofType(save),
    mergeMap(({ member }) => {
      return this.memberService.saveMember(member)
        .pipe(
          map(() => (saveSuccess())),
          catchError(() => of(saveError({ error: "member import failed" })))
        );
    })
  ));

  removeMember = createEffect(() => this.actions.pipe(
    ofType(remove),
    mergeMap(({ id }) => {
      return this.memberService.deleteMember(id)
        .pipe(
          map(() => (removeSuccess())),
          catchError(() => of(removeError({ error: "member remove failed" })))
        );
    })
  ));

  constructor(
    private actions: Actions,
    private memberService: MemberService
  ) { }
}