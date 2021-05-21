import { Injectable } from '@nestjs/common';
import { from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CarMakeInput } from 'src/graphql/schema/types';
import { ApolloService } from './apollo.service';
import { LIST_CAR_MAKE, CREATE_CAR_MAKE, DELETE_CAR_MAKE, UPDATE_CAR_MAKE, GET_CAR_MAKE_BY_NAME } from './graphql-queries.schema';

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
        map((data: any) => data.data.allCarMakes.nodes),
      );
  }

  getByName(name: string) {
    const query = this.apolloService.query({
      query: GET_CAR_MAKE_BY_NAME,
      variables: { name }
    });
    return from(query)
      .pipe(
        map((data: any) => data.data.allCarMakes.nodes),
        mergeMap((data) => data.length > 0 ? of(data[0]) : of(null))
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
        map((data: any) => data.data.createCarMake.carMake),
      );
  }

  getOrCreate(carMake: CarMakeInput) {
    return this.getByName(carMake.name)
      .pipe(
        mergeMap((data) => data == null ? this.create(carMake) : of(data)),
      );
  }

  update(carMake: CarMakeInput) {
    const mutation = this.apolloService.mutate({
      mutation: UPDATE_CAR_MAKE,
      variables: {
        ...carMake
      }
    });
    return from(mutation)
      .pipe(
        map((data: any) => data.data.updateCarMakeById.carMake),
      );
  }

  delete(id: number) {
    const mutation = this.apolloService.mutate({
      mutation: DELETE_CAR_MAKE,
      variables: { id: +id }
    });
    return from(mutation)
      .pipe(
        map((data: any) => data.data.deleteCarMakeById.deletedCarMakeId),
        map(() => ({ deletedCarMakeId: +id })),
      );
  }
}
