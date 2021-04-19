import { HttpModule, Module } from '@nestjs/common';
import { MinioClientModule } from './minio-client/minio-client.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { GraphQLModule } from '@nestjs/graphql';
import { FileImportModule } from './file-import/file-import.module';
import { FileExportModule } from './file-export/file-export.module';
import { MembersResolver } from './graphql/resolver/member.resolver';
import { MemberService } from './core/service/member.service';
import { ApolloService } from './core/service/apollo.service';
import { CarModelService } from './core/service/car-model.service';
import { CarMakeService } from './core/service/car-make.service';

@Module({
  controllers: [
  ],
  providers: [
    ApolloService,
    CarModelService,
    CarMakeService,
    MemberService,
    MembersResolver
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../config/.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      typePaths: ['./src/graphql/**/*.gql'],
      definitions: {
        path: './src/graphql/schema/types.ts',
        outputAs: 'class',
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env['REDIS_HOST'],
        port: +process.env['REDIS_PORT'],
      },
    }),
    HttpModule,
    MinioClientModule,
    FileImportModule,
    FileExportModule,
  ]
})
export class AppModule {
}
