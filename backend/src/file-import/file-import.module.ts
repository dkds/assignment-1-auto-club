import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { GraphQLModule } from 'src/graphql/graphql.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { FileImportController } from './file-import.controller';
import { ImportJobStatusSCClient } from './import-job-status-sc.client';
import { MemberImportProgressProcessor } from './member-import-progress.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'queue-file-read' }),
    MinioClientModule,
    GraphQLModule
  ],
  controllers: [
    FileImportController
  ],
  providers: [
    MemberImportProgressProcessor,
    ImportJobStatusSCClient
  ]
})
export class FileImportModule {
}
