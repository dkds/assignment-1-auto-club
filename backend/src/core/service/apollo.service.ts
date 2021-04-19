import { ApolloClient, HttpLink, InMemoryCache, MutationOptions, QueryOptions } from "@apollo/client";
import { Injectable } from "@nestjs/common";
import fetch from 'cross-fetch';

@Injectable()
export class ApolloService {

    private apolloClient!: ApolloClient<any>;

    constructor() {
        this.apolloClient = new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink({ uri: 'http://localhost:5000/graphql', fetch }),
        });
    }

    query(options: QueryOptions) {
        return this.apolloClient.query(options);
    }

    mutate(options: MutationOptions) {
        return this.apolloClient.mutate(options);
    }
}