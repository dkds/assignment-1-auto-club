import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { CarModelService } from "../../service/car-model.service";
import { listLoad, listLoadError, listLoadSuccess, listReload, remove, save, saveError, saveSuccess } from "./car-model.actions";

@Injectable()
export class CarModelEffects {

  loadCarModels = createEffect(() => this.actions.pipe(
    ofType(listLoad),
    mergeMap(() => {
      this.carModelService.loadCarModels();
      return this.carModelService.getCarModels()
        .pipe(
          map(carModels => (listLoadSuccess({ carModels }))),
          catchError(() => of(listLoadError({ error: "car model load failed" })))
        );
    })
  ));

  reloadCarModels = createEffect(() => this.actions.pipe(
    ofType(listReload),
    mergeMap(() => of(this.carModelService.refresh())
      .pipe(
        mergeMap(() => this.carModelService.getCarModels()
          .pipe(
            map(carModels => (listLoadSuccess({ carModels }))),
            catchError(() => of(listLoadError({ error: "car model load failed" })))
          )
        )
      )
    )
  ));

  deleteCarModel = createEffect(() => this.actions.pipe(
    ofType(remove),
    mergeMap(({ id }) => {
      return this.carModelService.deleteCarModel(id)
        .pipe(
          map(() => (saveSuccess())),
          catchError(() => of(saveError({ error: "car model delete failed" })))
        );
    })
  ));

  saveCarModel = createEffect(() => this.actions.pipe(
    ofType(save),
    mergeMap(({ carModel }) => {
      return this.carModelService.saveCarModel(carModel)
        .pipe(
          map(() => (saveSuccess())),
          catchError(() => of(saveError({ error: "car model save failed" })))
        );
    })
  ));

  constructor(
    private actions: Actions,
    private carModelService: CarModelService
  ) { }
}