import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { ImportJobStatusSCClient } from './export-job-status-sc.client';
import { FileExportController } from './file-export.controller';
import { MemberExportProgressProcessor } from './member-export-progress.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'queue-member-export' },
      { name: 'queue-member-export-progress' },
    ),
    MinioClientModule
  ],
  controllers: [
    FileExportController
  ],
  providers: [
    MemberExportProgressProcessor,
    ImportJobStatusSCClient
  ]
})
export class FileExportModule {
}
