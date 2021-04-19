import { HttpService, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, first, map, mergeMap, pluck } from 'rxjs/operators';
import {
    CREATE_CAR_MAKE,
    CREATE_CAR_MODEL,
    CREATE_MEMBER,
    GET_CAR_MAKE_BY_ID,
    GET_CAR_MAKE_BY_NAME,
    GET_CAR_MODEL_BY_ID,
    GET_CAR_MODEL_BY_NAME,
    GET_MEMBERS,
    GET_MEMBER_BY_NAME
} from './graphql-queries.schema';

const GRAPHQL_API_ENDPOINT = 'http://localhost:5000/graphql';
const REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

@Injectable()
export class GraphQLService {

    constructor(private readonly httpService: HttpService) { }

    createMember(member: {
        firstName: string,
        lastName: string,
        email: string,
        vinNumber: string,
        mfd: string,
        carModelId: number
    }) {
        const data = CREATE_MEMBER;
        data.variables = member;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data'),
                map((data: any) => data.createMember.member)
            );
    }

    createCarMake(name: string) {
        const data = CREATE_CAR_MAKE;
        data.variables.name = name;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data'),
                map((data: any) => data.createCarMake.carMake)
            );
    }

    createCarModel(name: string, carMakeId: number) {
        const data = CREATE_CAR_MODEL;
        data.variables.name = name;
        data.variables.carMakeId = carMakeId;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data'),
                map((data: any) => data.createCarModel.carModel)
            );
    }

    getCarMakeById(id: number) {
        const data = GET_CAR_MAKE_BY_ID;
        data.variables.id = id;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data', 'carMakeById'),
                catchError(error => {
                    return of({ error: true, body: error.response.data });
                })
            );
    }

    getCarMake(name: string) {
        const data = GET_CAR_MAKE_BY_NAME;
        data.variables.name = name;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data'),
                mergeMap((data: any) => data.allCarMakes.nodes),
                first(),
                catchError(error => {
                    return of({ error: true, body: error });
                })
            );
    }

    getCarModelById(id: number) {
        const data = GET_CAR_MODEL_BY_ID;
        data.variables.id = id;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data', 'carModelById'),
                catchError(error => {
                    return of({ error: true, body: error.response.data });
                })
            );
    }

    getCarModel(name: string, carMakeId: number) {
        const data = GET_CAR_MODEL_BY_NAME;
        data.variables.name = name;
        data.variables.carMakeId = carMakeId;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data'),
                mergeMap((data: any) => data.allCarModels.nodes),
                first(),
                catchError(error => {
                    return of({ error: true, body: error });
                })
            );
    }

    getMember(firstName: string, lastName: string, vin: string) {
        const data = GET_MEMBER_BY_NAME;
        data.variables.firstName = firstName;
        data.variables.lastName = lastName;
        data.variables.vin = vin;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data'),
                mergeMap((data: any) => data.allMembers.nodes),
                first(),
                catchError(error => {
                    return of({ error: true, body: error });
                })
            );
    }

    getMembers(variables: any) {
        console.log('variables', variables);

        const data = GET_MEMBERS;
        data.variables = variables;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data', 'allMembers', 'nodes'),
                catchError(error => {
                    return of({ error: true, body: error });
                })
            );
    }
    
    getMembersByAge(variables: any) {
        console.log('variables', variables);

        const data = GET_MEMBERS;
        data.variables = variables;

        return this.httpService.post(GRAPHQL_API_ENDPOINT, data, REQUEST_CONFIG)
            .pipe(
                pluck('data', 'data', 'allMembers', 'nodes'),
                catchError(error => {
                    return of({ error: true, body: error });
                })
            );
    }
}
