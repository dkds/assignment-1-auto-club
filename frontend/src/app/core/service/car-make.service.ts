import { Injectable } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { Apollo } from 'apollo-angular';
import { from, Observable, of, throwError } from 'rxjs';
import { map, mergeAll, mergeMap, toArray } from 'rxjs/operators';
import { CarMake } from '../model/car-make.model';
import { LIST_CAR_MAKE, CREATE_CAR_MAKE, UPDATE_CAR_MAKE, DELETE_CAR_MAKE } from '../config/graphql.queries';

@Injectable({
  providedIn: 'root'
})
export class CarMakeService {

  constructor(
    private logger: NGXLogger,
    private apollo: Apollo) {
  }

  getCarMakes(): Observable<CarMake[]> {
    this.logger.debug("getting car makes");
    return this.apollo.query({
      query: LIST_CAR_MAKE
    }).pipe(
      map((result: any) => result?.data?.carMakes),
      mergeAll(),
      map((data: any) => CarMake.fromObject(data)),
      toArray()
    );
  }

  saveCarMake(carMake: CarMake) {
    if (carMake.id) {
      return this.updateCarMake(carMake);
    } else {
      return this.createCarMake(carMake);
    }
  }

  deleteCarMake(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_CAR_MAKE,
      variables: { id }
    }).pipe(
      mergeMap((result: any) => {
        this.logger.debug("deleteCarMake", result);
        return this.responseHandler(result);
      }));
  }

  resetCache() {
    return from(this.apollo.client.resetStore());
  }

  private createCarMake(carMake: CarMake) {
    return this.apollo.mutate({
      mutation: CREATE_CAR_MAKE,
      variables: carMake
    }).pipe(
      mergeMap((result: any) => {
        this.logger.debug("createCarMake", result);
        return this.responseHandler(result);
      }));
  }

  private updateCarMake(carMake: CarMake) {
    return this.apollo.mutate({
      mutation: UPDATE_CAR_MAKE,
      variables: carMake
    }).pipe(
      mergeMap((result: any) => {
        this.logger.debug("updateCarMake", result);
        return this.responseHandler(result);
      }));
  }

  private responseHandler(result: any) {
    if (result.error) {
      return throwError(result.error);
    }
    return of(result?.data);
  }
}
