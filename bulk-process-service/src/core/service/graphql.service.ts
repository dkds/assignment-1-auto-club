import { Injectable } from '@nestjs/common';
import { from, of, throwError } from 'rxjs';
import { catchError, first, map, mergeMap, pluck, tap } from 'rxjs/operators';
import { ApolloService } from './apollo.service';
import {
  CREATE_CAR_MAKE,
  CREATE_CAR_MODEL,
  CREATE_MEMBER,
  GET_CAR_MAKE_BY_ID,
  CREATE_OR_GET_CAR_MAKE,
  GET_CAR_MODEL_BY_ID,
  CREATE_OR_GET_CAR_MODEL,
  GET_MEMBERS,
  GET_MEMBER_BY_NAME
} from './graphql-queries.schema';


@Injectable()
export class GraphQLService {

  constructor(
    private readonly apolloService: ApolloService) { }

  createMember(member: {
    firstName: string,
    lastName: string,
    email: string,
    vin: string,
    mfd: string,
    carModelId: number
  }) {
    return from(this.apolloService.mutate({
      mutation: CREATE_MEMBER,
      variables: { ...member }
    })).pipe(
      pluck('data', 'createMember'),
      catchError(error => {
        return of({ error: true, body: error?.response?.data });
      })
    );
  }

  createCarMake(name: string) {
    return from(this.apolloService.mutate({
      mutation: CREATE_CAR_MAKE,
      variables: { name }
    })).pipe(
      pluck('data', 'createCarMake'),
      catchError(error => {
        return of({ error: true, body: error?.response?.data });
      })
    );
  }

  createCarModel(name: string, carMakeId: number) {
    return from(this.apolloService.mutate({
      mutation: CREATE_CAR_MODEL,
      variables: { name, carMakeId }
    })).pipe(
      pluck('data', 'createCarModel'),
      catchError(error => {
        return of({ error: true, body: error?.response?.data });
      })
    );
  }

  getCarMakeById(id: number) {
    return from(this.apolloService.query({
      query: GET_CAR_MAKE_BY_ID,
      variables: { id }
    })).pipe(
      pluck('data', 'data', 'carMakeById'),
      catchError(error => {
        return of({ error: true, body: error?.response?.data });
      })
    );
  }

  createOrGetCarMake(name: string) {
    return from(this.apolloService.mutate({
      mutation: CREATE_OR_GET_CAR_MAKE,
      variables: { name: `${name}` }
    })).pipe(
      pluck('data', 'createOrGetCarMake'),
      catchError(error => {
        return of({ error: true, body: error?.response?.data });
      }),
    );
  }

  getCarModelById(id: number) {
    return from(this.apolloService.query({
      query: GET_CAR_MODEL_BY_ID,
      variables: { id }
    })).pipe(
      pluck('data', 'data', 'carMakeById'),
      catchError(error => {
        return of({ error: true, body: error?.response?.data });
      })
    );
  }

  createOrGetCarModel(name: string, carMakeId: number) {
    return from(this.apolloService.mutate({
      mutation: CREATE_OR_GET_CAR_MODEL,
      variables: { name: `${name}`, carMakeId }
    })).pipe(
      pluck('data', 'createOrGetCarModel'),
      mergeMap((data) => data == null ? throwError("not found") : of(data)),
      catchError(error => {
        return of({ error: true, body: error?.response?.data });
      })
    );
  }

  getMember(firstName: string, lastName: string, vin: string) {
    return from(this.apolloService.query({
      query: GET_MEMBER_BY_NAME,
      variables: { firstName, lastName, vin }
    })).pipe(
      pluck('data', 'memberByName'),
      mergeMap((data) => data == null ? throwError("not found") : of(data)),
      catchError(error => {
        return of({ error: true, body: error?.response?.data });
      })
    );
  }

  getMembersByQuery(query: any, variables: any) {
    return from(this.apolloService.query({
      query,
      variables
    })).pipe(
      pluck('data'),
      map((data) => {
        for (const key in data) {
          if (data.hasOwnProperty(key) && data[key].nodes) {
            return data[key].nodes;
          }
        }
      }),
      catchError(error => {
        return of({ error: true, body: error.response.data });
      }),
    );
  }

  getMembersByAge(variables: any) {
    return from(this.apolloService.query({
      query: GET_MEMBERS,
      variables: { ...variables }
    })).pipe(
      pluck('data', 'data', 'carMakeById'),
      first(),
      catchError(error => {
        return of({ error: true, body: error.response.data });
      })
    );
  }
}
