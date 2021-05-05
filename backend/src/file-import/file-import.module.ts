import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ImportJobStatusGateway } from 'src/file-import/import-job-status-ws.gateway';
import { GraphQLModule } from 'src/graphql/graphql.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { FileImportController } from './file-import.controller';
import { ImportJobStatusSCClient } from './import-job-status-sc.client';
import { MemberImportProgressProcessor } from './member-import-progress.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'queue-file-read' },
      { name: 'queue-member-import-progress' },
    ),
    MinioClientModule,
    GraphQLModule
  ],
  controllers: [
    FileImportController
  ],
  providers: [
    MemberImportProgressProcessor,
    ImportJobStatusGateway,
    ImportJobStatusSCClient
  ]
})
export class FileImportModule {
}
