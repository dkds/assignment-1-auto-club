import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { of } from "rxjs";
import { mergeMap, map, catchError, switchMap, tap } from "rxjs/operators";
import { CarMake } from "../../model/car-make.model";
import { CarMakeService } from "../../service/car-make.service";
import { CarMakeActions } from "./car-make.actions";
import { CarMakeSelectors } from "./car-make.selectors";

@Injectable()
export class CarMakeEffects {

  loadCarMakes = createEffect(() => this.actions$.pipe(
    ofType(CarMakeActions.listLoad),
    mergeMap(() => this.carMakeService.getCarMakes()
      .pipe(
        map((carMakes: CarMake[]) => (CarMakeActions.listLoadSuccess({ carMakes }))),
        catchError(() => of(CarMakeActions.listLoadError({ error: "Loading car makes failed" })))
      )
    )
  ));

  saveCarMake = createEffect(() => this.actions$.pipe(
    ofType(CarMakeActions.save),
    mergeMap(({ carMake }) => {
      return this.carMakeService.saveCarMake(carMake)
        .pipe(
          tap(() => CarMakeSelectors.changeFinished.release()),
          mergeMap(() => this.carMakeService.resetCache()),
          switchMap(() => [
            CarMakeActions.saveSuccess(),
            CarMakeActions.listLoad()
          ]),
          catchError(() => of(CarMakeActions.saveError({ error: `Saving car make '${carMake.name}' failed!` })))
        );
    })
  ));

  deleteCarMake = createEffect(() => this.actions$.pipe(
    ofType(CarMakeActions.remove),
    mergeMap(({ carMake }) => {
      return this.carMakeService.deleteCarMake(carMake.id)
        .pipe(
          tap(() => CarMakeSelectors.changeFinished.release()),
          mergeMap(() => this.carMakeService.resetCache()),
          switchMap(() => [
            CarMakeActions.removeSuccess(),
            CarMakeActions.listLoad()
          ]),
          catchError(() => of(CarMakeActions.removeError({ error: `Deleting car make '${carMake.name}' failed!` })))
        );
    })
  ));

  constructor(
    private actions$: Actions,
    private carMakeService: CarMakeService
  ) { }
}