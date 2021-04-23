import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { map, mergeAll, pluck, toArray } from 'rxjs/operators';
import { CarModelInput } from 'src/graphql/schema/types';
import { ApolloService } from './apollo.service';
import { CREATE_CAR_MODEL, DELETE_CAR_MODEL, LIST_CAR_MODEL, UPDATE_CAR_MODEL } from './graphql-queries.schema';

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
        map((carModel: any) => {
          const carModelData = {
            ...carModel,
            carMake: carModel.carMakeByCarMakeId.name,
          };
          delete carModelData.carMakeByCarMakeId;

          return carModelData;
        }),
        toArray(),
      );
  }

  create(carModel: CarModelInput) {
    const mutation = this.apolloService.mutate({
      mutation: CREATE_CAR_MODEL,
      variables: {
        ...carModel,
        carMakeId: carModel.carMake.id
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data'),
        map((data: any) => data.createCarModel.carModel),
        map((carModel: any) => {
          const carModelData = {
            ...carModel,
            carMake: carModel.carMakeByCarMakeId.name,
          };
          delete carModelData.carMakeByCarMakeId;

          return carModelData;
        }),
      );
  }

  update(carModel: CarModelInput) {
    const mutation = this.apolloService.mutate({
      mutation: UPDATE_CAR_MODEL,
      variables: {
        ...carModel,
        carMakeId: carModel.carMake.id
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data'),
        map((data: any) => data.updateCarModelById.carModel),
        map((carModel: any) => {
          const carModelData = {
            ...carModel,
            carMake: carModel.carMakeByCarMakeId.name,
          };
          delete carModelData.carMakeByCarMakeId;

          return carModelData;
        }),
      );
  }

  delete(id: number) {
    const mutation = this.apolloService.mutate({
      mutation: DELETE_CAR_MODEL,
      variables: {
        id
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data'),
        map((data: any) => data.deletedCarModelId.deletedCarModelId)
      );
  }
}
