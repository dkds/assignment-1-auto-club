import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, throwError } from 'rxjs';
import { first, map, mergeAll } from 'rxjs/operators';
import { CarModel } from '../model/car-model.model';
import { LIST_CAR_MODEL, CREATE_CAR_MODEL, UPDATE_CAR_MODEL, DELETE_CAR_MODEL } from './graphql.schema';

@Injectable({
  providedIn: 'root'
})
export class CarModelService {

  private carModelSubject: Subject<CarModel[]> = new BehaviorSubject([] as CarModel[]);
  private listQuery: QueryRef<any> = this.apollo.watchQuery({
    query: LIST_CAR_MODEL,
    pollInterval: 60000
  });
  private subscription?: Subscription;

  constructor(private apollo: Apollo) {
  }

  loadCarModels() {
    if (this.subscription) {
      return this.listQuery.refetch();
    } else {
      this.subscription = this.listQuery.valueChanges.subscribe((result: any) => {
        console.log("initDataCarModels", result);

        const carModels = result?.data?.carModels;

        this.carModelSubject.next(carModels);
      });
      return Promise.resolve();
    }
  }

  getCarModels(): Observable<CarModel[]> {
    return this.carModelSubject.asObservable();
  }

  getCarModel(id: number): Observable<CarModel> {
    return this.carModelSubject
      .pipe(
        mergeAll(),
        first((carMake: CarModel) => carMake.id == id)
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
    }).pipe(map((result: any) => {
      console.log("deleteCarModel", result);
      return this.responseHandler(result);
    }));
  }

  private createCarModel(carModel: CarModel) {
    return this.apollo.mutate({
      mutation: CREATE_CAR_MODEL,
      variables: { ...carModel, carMakeId: carModel.carMake?.id }
    }).pipe(map((result: any) => {
      console.log("createCarModel", result);
      return this.responseHandler(result);
    }));
  }

  private updateCarModel(carModel: CarModel) {
    return this.apollo.mutate({
      mutation: UPDATE_CAR_MODEL,
      variables: { ...carModel, carMakeId: carModel.carMake?.id }
    }).pipe(map((result: any) => {
      console.log("updateCarModel", result);
      return this.responseHandler(result);
    }));
  }

  private responseHandler(result: any) {
    if (result.error) {
      return throwError(result.error);
    }
    return EMPTY;
  }
}
