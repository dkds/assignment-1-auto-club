import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { gql } from '@apollo/client';
import { ApolloService } from './apollo.service';

@Injectable()
export class CarModelService {

    constructor(private readonly apolloService: ApolloService) {
    }

    findAll() {
        const query = this.apolloService.query({
            query: gql`
            query ($first: Int!) {
                allMembers(first: $first) {
                    nodes {
                        id
                        firstName
                        lastName
                        email
                        vin
                        manufacturedDate
                        carModelId
                    }
                }
            }
            `,
            variables: { first: 10 }
        });
        return from(query)
            .pipe(
                pluck('data', 'allMembers', 'nodes'),
            );
    }


    getCarModelById(id: number) {
        const query = this.apolloService.query({
            query: gql`
            query ($id: Int!) {
                carModelById(id: $id) {
                    name
                    carMakeId
                }
            }
            `,
            variables: { id }
        });
        return from(query)
            .pipe(
                pluck('data', 'carModelById'),
            );
    }
}
