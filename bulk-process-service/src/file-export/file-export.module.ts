import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { ApolloService } from 'src/core/service/apollo.service';
import { GraphQLService } from 'src/core/service/graphql.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { MemberExportProcessor } from './member-export.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'queue-member-export' }),
    MinioClientModule,
    HttpModule,
  ],
  providers: [
    ApolloService,
    GraphQLService,
    MemberExportProcessor,
  ]
})
export class FileExportModule {
}
