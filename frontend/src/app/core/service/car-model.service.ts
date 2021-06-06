import { Injectable } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { Apollo } from 'apollo-angular';
import { from, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CarModel } from '../model/car-model.model';
import { LIST_CAR_MODEL, CREATE_CAR_MODEL, UPDATE_CAR_MODEL, DELETE_CAR_MODEL } from '../config/graphql.queries';

@Injectable({
  providedIn: 'root'
})
export class CarModelService {

  constructor(
    private logger: NGXLogger,
    private apollo: Apollo) {
  }

  getCarModels(): Observable<CarModel[]> {
    this.logger.debug("getting car models");
    return this.apollo.query({
      query: LIST_CAR_MODEL
    }).pipe(
      map((result: any) => result?.data?.carModels),
    );
  }

  saveCarModel(carModel: CarModel) {
    if (carModel.id) {
      return this.updateCarModel(carModel);
    } else {
      return this.createCarModel(carModel);
    }
  }

  deleteCarModel(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_CAR_MODEL,
      variables: { id }
    }).pipe(
      map((result: any) => {
        this.logger.debug("deleteCarModel", result);
        return this.responseHandler(result);
      })
    );
  }

  resetCache() {
    return from(this.apollo.client.resetStore());
  }

  private createCarModel(carModel: CarModel) {
    return this.apollo.mutate({
      mutation: CREATE_CAR_MODEL,
      variables: { ...carModel, carMakeId: carModel.carMake?.id }
    }).pipe(
      map((result: any) => {
        this.logger.debug("createCarModel", result);
        return this.responseHandler(result);
      })
    );
  }

  private updateCarModel(carModel: CarModel) {
    return this.apollo.mutate({
      mutation: UPDATE_CAR_MODEL,
      variables: { ...carModel, carMakeId: carModel.carMake?.id }
    }).pipe(
      map((result: any) => {
        this.logger.debug("updateCarModel", result);
        return this.responseHandler(result);
      })
    );
  }

  private responseHandler(result: any) {
    if (result.error) {
      return throwError(result.error);
    }
    return of(result?.data);
  }
}
