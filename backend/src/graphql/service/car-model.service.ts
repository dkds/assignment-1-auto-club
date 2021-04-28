import { Injectable } from '@nestjs/common';
import { from, of } from 'rxjs';
import { first, map, mergeAll, mergeMap, pluck, tap, toArray } from 'rxjs/operators';
import { CarModelInput } from 'src/graphql/schema/types';
import { ApolloService } from './apollo.service';
import { CREATE_CAR_MODEL, DELETE_CAR_MODEL, GET_CAR_MODEL_BY_NAME, LIST_CAR_MODEL, UPDATE_CAR_MODEL } from './graphql-queries.schema';

@Injectable()
export class CarModelService {

  constructor(private readonly apolloService: ApolloService) {
  }

  list(criteria: {
    first: number,
    offset: number,
    orderBy: string
  }) {
    const query = this.apolloService.query({
      query: LIST_CAR_MODEL,
      variables: {
        ...criteria
      }
    });
    return from(query)
      .pipe(
        pluck('data', 'allCarModels', 'nodes'),
        mergeAll(),
        map(this.mapCarModelView()),
        toArray(),
      );
  }


  getByName(name: string, carMakeId: number) {
    const query = this.apolloService.query({
      query: GET_CAR_MODEL_BY_NAME,
      variables: { name, carMakeId }
    });
    return from(query)
      .pipe(
        pluck('data', 'allCarModels', 'nodes'),
        mergeMap((data) => data.length > 0
          ? of(data[0]).pipe(map(this.mapCarModelView()))
          : of(null)
        ),
      );
  }

  create(carModel: CarModelInput) {
    const mutation = this.apolloService.mutate({
      mutation: CREATE_CAR_MODEL,
      variables: {
        ...carModel,
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'createCarModel', 'carModel'),
        map(this.mapCarModelView()),
      );
  }
  
  getOrCreate(carModel: CarModelInput) {
    return this.getByName(carModel.name, carModel.carMakeId)
      .pipe(
        mergeMap((data) => data == null ? this.create(carModel) : of(data)))
  }

  update(carModel: CarModelInput) {
    const mutation = this.apolloService.mutate({
      mutation: UPDATE_CAR_MODEL,
      variables: {
        ...carModel,
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'updateCarModelById', 'carModel'),
        map(this.mapCarModelView()),
      );
  }

  delete(id: number) {
    const mutation = this.apolloService.mutate({
      mutation: DELETE_CAR_MODEL,
      variables: { id: +id }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'deletedCarModelId'),
        map((data) => ({ deletedCarModelId: +id })),
      );
  }

  private mapCarModelView(): (value: any, index: number) => any {
    return (carModel: any) => {
      
      const carModelData = {
        ...carModel,
        carMake: {
          ...carModel.carMakeByCarMakeId
        },
      };
      delete carModelData.carMakeByCarMakeId;

      return carModelData;
    };
  }
}
