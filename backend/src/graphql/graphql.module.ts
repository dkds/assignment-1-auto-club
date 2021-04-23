import { Module } from "@nestjs/common";
import { GraphQLModule as GraphQL } from "@nestjs/graphql";
import { CarMakeResolver } from "./resolver/car-make.resolver";
import { CarModelResolver } from "./resolver/car-model.resolver";
import { MembersResolver } from "./resolver/member.resolver";
import { ApolloService } from "./service/apollo.service";
import { CarMakeService } from "./service/car-make.service";
import { CarModelService } from "./service/car-model.service";
import { MemberService } from "./service/member.service";

@Module({
  providers: [
    ApolloService,
    MemberService,
    CarModelService,
    CarMakeService,
    MembersResolver,
    CarModelResolver,
    CarMakeResolver,
  ],
  imports: [
    GraphQL.forRoot({
      debug: true,
      playground: true,
      typePaths: ['./src/graphql/**/*.gql'],
      definitions: {
        path: './src/graphql/schema/types.ts',
        outputAs: 'class',
      },
    }),
  ]
})
export class GraphQLModule {
}
