import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { map, mergeAll, pluck, toArray } from 'rxjs/operators';
import { CarMakeInput } from 'src/graphql/schema/types';
import { ApolloService } from './apollo.service';
import { LIST_CAR_MAKE, CREATE_CAR_MAKE, DELETE_CAR_MAKE, UPDATE_CAR_MAKE } from './graphql-queries.schema';

@Injectable()
export class CarMakeService {

  constructor(private readonly apolloService: ApolloService) {
  }

  list(criteria: {
    first: number,
    offset: number,
    orderBy: string
  }) {
    const query = this.apolloService.query({
      query: LIST_CAR_MAKE,
      variables: {
        ...criteria
      }
    });
    return from(query)
      .pipe(
        pluck('data', 'allCarMakes', 'nodes'),
      );
  }

  create(carMake: CarMakeInput) {
    const mutation = this.apolloService.mutate({
      mutation: CREATE_CAR_MAKE,
      variables: {
        ...carMake
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data', 'createCarMake', 'carMake'),
      );
  }

  update(carModel: CarMakeInput) {
    const mutation = this.apolloService.mutate({
      mutation: UPDATE_CAR_MAKE,
      variables: {
        ...carModel
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data', 'updateCarMakeById', 'carMake'),
      );
  }

  delete(id: number) {
    const mutation = this.apolloService.mutate({
      mutation: DELETE_CAR_MAKE,
      variables: {
        id
      }
    });
    return from(mutation)
      .pipe(
        pluck('data', 'data', 'deleteCarMakeById', 'deletedCarMakeId'),
      );
  }
}
