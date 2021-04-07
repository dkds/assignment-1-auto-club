import { HttpService, Injectable } from '@nestjs/common';
import { of } from 'rxjs';
import { catchError, first, map, mergeMap, pluck } from 'rxjs/operators';
import { CREATE_CAR_MAKE, CREATE_CAR_MODEL, CREATE_MEMBER, GET_CAR_MAKE_BY_NAME, GET_CAR_MODEL_BY_NAME, GET_MEMBER_BY_NAME } from './graphql-queries.schema';

const GRAPHQL_API_ENDPOINT = 'http://localhost:5000/graphql';
const REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

@Injectable()
export class GraphqlService {

    constructor(private readonly httpService: HttpService) { }

    createMember(carMake: {
        firstName: string,
        lastName: string,
        email: string,
        vinNumber: string,
        mfd: string,
        carModelId: number
    }) {
        const data = CREATE_MEMBER;
        data.variables = carMake;

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

    getCarModel(name: number, carMakeId: number) {
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
}
