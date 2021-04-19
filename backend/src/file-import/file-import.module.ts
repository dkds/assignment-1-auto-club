import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ImportJobStatusGateway } from 'src/file-import/import-job-status.gateway';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { FileImportController } from './file-import.controller';
import { MemberImportProgressProcessor } from './member-import-progress.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'queue-file-read' },
      { name: 'queue-member-import-progress' },
    ),
    MinioClientModule
  ],
  controllers: [
    FileImportController
  ],
  providers: [
    MemberImportProgressProcessor,
    ImportJobStatusGateway
  ]
})
export class FileImportModule {
}
