import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { BehaviorSubject, EMPTY, from, Observable, Subject, Subscription, throwError } from 'rxjs';
import { first, last, map, mergeAll, mergeMap, tap, toArray } from 'rxjs/operators';
import { CarMake } from 'src/app/car-make/model/car-make.model';
import { CarMakeService } from 'src/app/car-make/service/car-make.service';
import { CarModel } from '../model/car-model.model';

const LIST_CAR_MODEL = gql`
  query {
    allCarModels {
      nodes {
        id,
        carMakeId,
        name
      }
    }
  }`;

const CREATE_CAR_MODEL = gql`
  mutation ($carMakeId: Int!, $name: String!) {
    createCarModel(input: {carModel: {carMakeId: $carMakeId, name: $name}}) {
      carModel {
        id
        carMakeId
        name
      }
    }
  }`;

const UPDATE_CAR_MODEL = gql`
  mutation ($id: Int!, $carMakeId: Int!, $name: String!) {
    updateCarModelById(input: {id: $id, carModelPatch: {carMakeId: $carMakeId, name: $name}}) {
      carModel {
        id
        carMakeId
        name
      }
    }
  }`;

const DELETE_CAR_MODEL = gql`
  mutation ($id: Int!) {
    deleteCarModelById(input: {id: $id}) {
      deletedCarModelId
    }
  }`;

@Injectable({
  providedIn: 'root'
})
export class CarModelService {

  private carModels: CarModel[] = [];
  private carModelSubject: Subject<CarModel[]> = new BehaviorSubject(this.carModels);
  private subscriptions: Subscription = new Subscription();

  private listQuery: QueryRef<any> = this.apollo.watchQuery({ query: LIST_CAR_MODEL });

  constructor(
    private apollo: Apollo,
    private carMakeService: CarMakeService) {
    this.initData();
  }

  private initData() {
    console.log("getting data");
    this.subscriptions.add(this.listQuery.valueChanges.subscribe((result: any) => {
      console.log("initData", result);
      from(result?.data?.allCarModels?.nodes)
        .pipe(
          mergeMap((data: any) => {
            const carModel = CarModel.fromObject(data);
            return this.carMakeService.getCarMake(data.carMakeId as number)
              .pipe(
                map((carMake: CarMake) => {
                  carModel.carMake = carMake;
                  return carModel;
                }));
          }),
          toArray()
        ).subscribe((data: CarModel[]) => {
          console.log(data);
          this.carModels = data;
          this.carModelSubject.next(this.carModels);
        });
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
    this.refresh();
    return EMPTY;
  }

  refresh() {
    return this.listQuery.refetch();
  }

  getCarModels(): Subject<CarModel[]> {
    return this.carModelSubject;
  }

  getCarModel(id: number): Observable<CarModel> {
    if (this.carModels.length) {
      return from(this.carModels)
        .pipe(first((carMake: CarModel) => carMake.id == id));
    } else {
      return this.carModelSubject
        .pipe(
          mergeAll(),
          first((carMake: CarModel) => carMake.id == id)
        );
    }
  }
  
  saveCarModel(carModel: CarModel) {
    if (carModel.id) {
      return this.updateCarModel(carModel);
    } else {
      return this.createCarModel(carModel);
    }
  }

  deleteCarModel(carModel: CarModel) {
    return this.apollo.mutate({
      mutation: DELETE_CAR_MODEL,
      variables: carModel
    }).pipe(map((result: any) => {
      console.log("deleteCarModel", result);
      return this.responseHandler(result);
    }));
  }
}
