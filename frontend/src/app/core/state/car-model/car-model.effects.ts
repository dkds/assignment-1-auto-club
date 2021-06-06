import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { mergeMap, map, catchError, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { CarModel } from "../../model/car-model.model";
import { CarModelService } from "../../service/car-model.service";
import { CarModelActions } from "./car-model.actions";
import { CarModelSelectors } from "./car-model.selectors";

@Injectable()
export class CarModelEffects {

  loadCarModels = createEffect(() => this.actions$.pipe(
    ofType(CarModelActions.listLoad),
    mergeMap(() => this.carModelService.getCarModels()
    .pipe(
      mergeMap((carModels: CarModel[]) => of(CarModelActions.listLoadSuccess({ carModels }))),
      catchError(() => of(CarModelActions.listLoadError({ error: "Loading car models failed" })))
    )
    )
  ));

  saveCarModel = createEffect(() => this.actions$.pipe(
    ofType(CarModelActions.save),
    mergeMap(({ carModel }) => this.carModelService.saveCarModel(carModel)
      .pipe(
        tap(() => CarModelSelectors.changeFinished.release()),
        mergeMap(() => this.carModelService.resetCache()),
        switchMap(() => [
          CarModelActions.saveSuccess(),
          CarModelActions.listLoad()
        ]),
        catchError(() => of(CarModelActions.saveError({ error: `Saving car model '${carModel.name}' failed!` })))
      )
    )
  ));

  deleteCarModel = createEffect(() => this.actions$.pipe(
    ofType(CarModelActions.remove),
    mergeMap(({ carModel }) => this.carModelService.deleteCarModel(carModel.id)
      .pipe(
        tap(() => CarModelSelectors.changeFinished.release()),
        mergeMap(() => this.carModelService.resetCache()),
        switchMap(() => [
          CarModelActions.removeSuccess(),
          CarModelActions.listLoad()
        ]),
        catchError(() => of(CarModelActions.removeError({ error: `Deleting car model '${carModel.name}' failed!` })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private carModelService: CarModelService) { }
}