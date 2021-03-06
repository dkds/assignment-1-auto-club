import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { ApolloService } from 'src/core/service/apollo.service';
import { GraphQLService } from 'src/core/service/graphql.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { FileReadWorker } from './file-read.processor';
import { MemberImportWorker } from './member-import.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'queue-file-read' },
      { name: 'queue-member-import' },
    ),
    MinioClientModule,
    HttpModule,
  ],
  providers: [
    FileReadWorker,
    ApolloService,
    GraphQLService,
    MemberImportWorker,
  ]
})
export class FileImportModule {
}
