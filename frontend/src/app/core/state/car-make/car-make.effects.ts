import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { CarMakeService } from "../../service/car-make.service";
import { listLoad, listLoadError, listLoadSuccess, listReload, remove, save, saveError, saveSuccess } from "./car-make.actions";

@Injectable()
export class CarMakeEffects {

  loadCarMakes = createEffect(() => this.actions.pipe(
    ofType(listLoad),
    mergeMap(() => {
      this.carMakeService.loadCarMakes();
      return this.carMakeService.getCarMakes()
        .pipe(
          map(carMakes => (listLoadSuccess({ carMakes }))),
          catchError(() => of(listLoadError({ error: "car model load failed" })))
        );
    })
  ));

  reloadCarMakes = createEffect(() => this.actions.pipe(
    ofType(listReload),
    mergeMap(() => of(this.carMakeService.refresh())
      .pipe(
        mergeMap(() => this.carMakeService.getCarMakes()
          .pipe(
            map(carMakes => (listLoadSuccess({ carMakes }))),
            catchError(() => of(listLoadError({ error: "car model load failed" })))
          )
        )
      )
    )
  ));

  deleteCarMake = createEffect(() => this.actions.pipe(
    ofType(remove),
    mergeMap(({ id }) => {
      return this.carMakeService.deleteCarMake(id)
        .pipe(
          map(() => (saveSuccess())),
          catchError(() => of(saveError({ error: "car model delete failed" })))
        );
    })
  ));

  saveCarMake = createEffect(() => this.actions.pipe(
    ofType(save),
    mergeMap(({ carMake }) => {
      return this.carMakeService.saveCarMake(carMake)
        .pipe(
          map(() => (saveSuccess())),
          catchError(() => of(saveError({ error: "car model save failed" })))
        );
    })
  ));

  constructor(
    private actions: Actions,
    private carMakeService: CarMakeService
  ) { }
}