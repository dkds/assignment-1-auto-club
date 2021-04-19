import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { ExportJobStatusGateway } from './export-job-status.gateway';
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
    ExportJobStatusGateway
  ]
})
export class FileExportModule {
}
