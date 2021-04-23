import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { MemberService } from "../../service/member.service";
import { getExportCriteriaList, exportList, exportListError, exportListSuccess, importList, importListError, importListSuccess, listLoad, listLoadError, listLoadSuccess, listReload, save, saveError, saveSuccess, getExportCriteriaListSuccess, getExportCriteriaListError, listNavigate, listSort, listSearch } from "./member.actions";

@Injectable()
export class MemberEffects {

  loadMembers = createEffect(() => this.actions.pipe(
    ofType(listLoad),
    mergeMap(() => {
      this.memberService.loadMemberList();
      return this.memberService.getMembers()
        .pipe(
          map(memberPage => (listLoadSuccess({ ...memberPage }))),
          catchError(() => of(listLoadError({ error: "member load failed" })))
        );
    })
  ));

  reloadMembers = createEffect(() => this.actions.pipe(
    ofType(listReload),
    mergeMap(() => of(this.memberService.refresh())
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
    mergeMap(({ query }) => of(this.memberService.refresh({ query }))
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
    mergeMap(({ sortMode }) => of(this.memberService.refresh({ orderBy: sortMode }))
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
    mergeMap(({ first, offset }) => of(this.memberService.refresh({ first, offset }))
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
    ofType(importList),
    mergeMap(({ fileSource }) => {
      const formData = new FormData();
      formData.append("file", fileSource);
      return this.memberService.importFile(formData)
        .pipe(
          map(response => (importListSuccess({ jobId: response.jobId }))),
          catchError(() => of(importListError({ error: "member import failed" })))
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

  exportMembers = createEffect(() => this.actions.pipe(
    ofType(exportList),
    mergeMap(({ criteria, variables }) => {
      return this.memberService.requestExport(criteria, variables)
        .pipe(
          map(response => (exportListSuccess({ jobId: response.jobId }))),
          catchError(() => of(exportListError({ error: "member export failed" })))
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

  constructor(
    private actions: Actions,
    private memberService: MemberService
  ) { }
}