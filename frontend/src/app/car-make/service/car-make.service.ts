import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { BehaviorSubject, EMPTY, from, Observable, Subject, Subscription, throwError } from 'rxjs';
import { filter, first, map, mergeAll } from 'rxjs/operators';
import { CarMake } from '../model/car-make.model';

const LIST_CAR_MAKE = gql`
  query {
    allCarMakes {
      nodes {
        id
        name
      }
    }
  }`;

const CREATE_CAR_MAKE = gql`
  mutation ($name: String!) {
    createCarMake(input: {carMake: {name: $name}}) {
      carMake {
        id
        name
      }
    }
  }`;

const UPDATE_CAR_MAKE = gql`
  mutation ($id: Int!, $name: String!) {
    updateCarMakeById(input: {id: $id, carMakePatch: {name: $name}}) {
      carMake {
        id, name
      }
    }
  }`;

const DELETE_CAR_MAKE = gql`
  mutation ($id: Int!) {
    deleteCarMakeById(input: {id: $id}) {
      deletedCarMakeId
    }
  }`;


@Injectable({
  providedIn: 'root'
})
export class CarMakeService {

  private carMakes: CarMake[] = [];
  private carMakeSubject: Subject<CarMake[]> = new BehaviorSubject(this.carMakes);

  private subscriptions: Subscription = new Subscription();

  private listQuery: QueryRef<any> = this.apollo.watchQuery({ query: LIST_CAR_MAKE });

  constructor(private apollo: Apollo) {
    this.initData();
  }

  private initData() {
    console.log("getting data");
    this.subscriptions.add(this.listQuery.valueChanges.subscribe((result: any) => {
      console.log("initData", result);
      this.carMakes = result?.data?.allCarMakes?.nodes?.map((data: any) => CarMake.fromObject(data));
      this.carMakeSubject.next(this.carMakes);
    }));
  }

  private createCarMake(carMake: CarMake) {
    return this.apollo.mutate({
      mutation: CREATE_CAR_MAKE,
      variables: carMake
    }).pipe(map((result: any) => {
      console.log("createCarMake", result);
      return this.responseHandler(result);
    }));
  }

  private updateCarMake(carMake: CarMake) {
    return this.apollo.mutate({
      mutation: UPDATE_CAR_MAKE,
      variables: carMake
    }).pipe(map((result: any) => {
      console.log("updateCarMake", result);
      return this.responseHandler(result);
    }));
  }

  private responseHandler(result: any) {
    if (result.error) {
      return throwError(result.error);
    }
    this.refresh();
    return EMPTY;
  }

  refresh() {
    return this.listQuery.refetch();
  }

  getCarMake(id: number): Observable<CarMake> {
    if (this.carMakes.length) {
      return from(this.carMakes)
        .pipe(first((carMake: CarMake) => carMake.id == id));
    } else {
      return this.carMakeSubject
        .pipe(
          mergeAll(),
          first((carMake: CarMake) => carMake.id == id)
        );
    }
  }

  getCarMakes(): Subject<CarMake[]> {
    return this.carMakeSubject;
  }

  saveCarMake(carMake: CarMake) {
    if (carMake.id) {
      return this.updateCarMake(carMake);
    } else {
      return this.createCarMake(carMake);
    }
  }

  deleteCarMake(carMake: CarMake) {
    return this.apollo.mutate({
      mutation: DELETE_CAR_MAKE,
      variables: carMake
    }).pipe(map((result: any) => {
      console.log("deleteCarMake", result);
      return this.responseHandler(result);
    }));
  }
}
