import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { mergeMap, map, catchError, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { MemberPage } from "../../model/member-page.model";
import { MemberService } from "../../service/member.service";
import { MemberActions } from "./member.actions";
import { MemberSelectors } from "./member.selectors";

@Injectable()
export class MemberEffects {

  loadMembers = createEffect(() => this.actions$.pipe(
    ofType(MemberActions.listLoad),
    withLatestFrom(this.store.select(MemberSelectors.listMembersVariables)),
    mergeMap(([, { first, offset, orderBy, query }]) => this.memberService.getMembers({ first, offset, orderBy, query })
      .pipe(
        map((memberPage: MemberPage) => (MemberActions.listLoadSuccess({ ...memberPage }))),
        catchError(() => of(MemberActions.listLoadError({ error: "member load failed" })))
      )
    )
  ));

  queryMemberList = createEffect(() => this.actions$.pipe(
    ofType(MemberActions.listSearch, MemberActions.listSort, MemberActions.listNavigate),
    mergeMap(() => of(MemberActions.listLoad())),
  ));

  importListSuccess = createEffect(() => this.actions$.pipe(
    ofType(MemberActions.importListRequestSuccess),
    mergeMap(() => of(MemberActions.listLoad())),
  ));

  importMembers = createEffect(() => this.actions$.pipe(
    ofType(MemberActions.importListRequest),
    mergeMap(({ fileSource }) => {

      const formData = new FormData();
      formData.append("file", fileSource);

      return this.memberService.importFile(formData)
        .pipe(
          map(response => (MemberActions.importListRequestSuccess({ jobId: response.jobId }))),
          catchError(() => of(MemberActions.importListRequestError({ error: "member import failed" })))
        );
    })
  ));

  exportCriterias = createEffect(() => this.actions$.pipe(
    ofType(MemberActions.getExportCriteriaList),
    mergeMap(() => this.memberService.exportCriterias()
      .pipe(
        map(response => MemberActions.getExportCriteriaListSuccess({ criterias: response })),
        catchError(() => of(MemberActions.getExportCriteriaListError({ error: "export criterias failed" })))
      )
    )
  ));

  exportMembersRequest = createEffect(() => this.actions$.pipe(
    ofType(MemberActions.exportListRequest),
    mergeMap(({ criteria, variables }) => this.memberService.requestExport(criteria, variables)
      .pipe(
        map(response => (MemberActions.exportListRequestSuccess({ jobId: response.jobId }))),
        catchError(() => of(MemberActions.exportListRequestError({ error: "member export request failed" })))
      )
    )
  ));

  saveMember = createEffect(() => this.actions$.pipe(
    ofType(MemberActions.save),
    mergeMap(({ member }) => this.memberService.saveMember(member)
      .pipe(
        tap(() => MemberSelectors.changeFinished.release()),
        mergeMap(() => this.memberService.resetCache()),
        switchMap(() => [
          MemberActions.saveSuccess(),
          MemberActions.listLoad()
        ]),
        catchError(() => of(MemberActions.saveError({ error: `Saving member '${member.firstName} ${member.lastName}' failed!` })))
      )
    )
  ));

  removeMember = createEffect(() => this.actions$.pipe(
    ofType(MemberActions.remove),
    mergeMap(({ member }) => this.memberService.deleteMember(member.id)
      .pipe(
        tap(() => MemberSelectors.changeFinished.release()),
        mergeMap(() => this.memberService.resetCache()),
        switchMap(() => [
          MemberActions.removeSuccess(),
          MemberActions.listLoad()
        ]),
        catchError(() => of(MemberActions.removeError({ error: `Deleting member '${member.firstName} ${member.lastName}' failed!` })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private memberService: MemberService,
    private store: Store) { }
}