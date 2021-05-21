import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
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
    GraphQL.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        debug: true,
        playground: true,
        typePaths: [`${process.cwd()}/${configService.get('GRAPHQL_SCHEMA_PATH')}/*.gql`],
        definitions: {
          path: `${configService.get('GRAPHQL_SCHEMA_PATH')}/types.ts`,
          outputAs: 'class',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [
    ApolloService,
  ]
})
export class GraphQLModule {
}
