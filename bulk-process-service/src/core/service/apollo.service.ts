import { ApolloClient, DefaultOptions, HttpLink, InMemoryCache, MutationOptions, QueryOptions } from "@apollo/client";
import { Injectable } from "@nestjs/common";
import fetch from 'cross-fetch';

@Injectable()
export class ApolloService {

  private apolloClient!: ApolloClient<any>;

  constructor() {
    const defaultOptions: DefaultOptions = {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    };
    this.apolloClient = new ApolloClient({
      cache: new InMemoryCache({
        resultCaching: false
      }),
      link: new HttpLink({ uri: `http://${process.env['BACKEND_HOST']}:${process.env['BACKEND_PORT']}/graphql`, fetch }),
      defaultOptions
    });
  }

  query(options: QueryOptions) {
    return this.apolloClient.query(options);
  }

  mutate(options: MutationOptions) {
    return this.apolloClient.mutate(options);
  }
}