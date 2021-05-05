import { Injectable } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { first, map, mergeAll, mergeMap } from 'rxjs/operators';
import { CarMake } from '../model/car-make.model';
import { LIST_CAR_MAKE, CREATE_CAR_MAKE, UPDATE_CAR_MAKE, DELETE_CAR_MAKE } from './graphql.schema';

@Injectable({
  providedIn: 'root'
})
export class CarMakeService {

  private carMakeSubject: Subject<CarMake[]> = new BehaviorSubject([] as CarMake[]);
  private listQuery: QueryRef<any> = this.apollo.watchQuery({ query: LIST_CAR_MAKE });

  constructor(
    private logger: NGXLogger,
    private apollo: Apollo) {
  }

  loadCarMakes() {
    this.logger.debug("getting data");
    this.listQuery.valueChanges.subscribe((result: any) => {
      this.logger.debug("initDataCarMakes", result);
      const carMakes = result?.data?.carMakes?.map((data: any) => CarMake.fromObject(data));
      this.carMakeSubject.next(carMakes);
    });
  }

  refresh() {
    return this.listQuery.refetch();
  }

  getCarMake(id: number): Observable<CarMake> {
    return this.carMakeSubject
      .pipe(
        mergeAll(),
        first((carMake: CarMake) => carMake.id == id)
      );
  }

  getCarMakes(): Observable<CarMake[]> {
    return this.carMakeSubject.asObservable();
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
    }).pipe(mergeMap((result: any) => {
      this.logger.debug("deleteCarMake", result);
      return this.responseHandler(result);
    }));
  }

  private createCarMake(carMake: CarMake) {
    return this.apollo.mutate({
      mutation: CREATE_CAR_MAKE,
      variables: carMake
    }).pipe(mergeMap((result: any) => {
      this.logger.debug("createCarMake", result);
      return this.responseHandler(result);
    }));
  }

  private updateCarMake(carMake: CarMake) {
    return this.apollo.mutate({
      mutation: UPDATE_CAR_MAKE,
      variables: carMake
    }).pipe(mergeMap((result: any) => {
      this.logger.debug("updateCarMake", result);
      return this.responseHandler(result);
    }));
  }

  private responseHandler(result: any) {
    if (result.error) {
      return throwError(result.error);
    }
    this.refresh();
    return of(result?.data);
  }
}
