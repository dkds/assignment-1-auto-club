import { HttpModule, Module } from '@nestjs/common';
import { FileImportController } from './gateway/file-import.controller';
import { FileImportService } from './service/file-import.service';
import { JobStatusGateway } from './gateway/job-status.gateway';
import { QueueService } from './service/queue.service';

@Module({
  controllers: [FileImportController],
  providers: [FileImportService, JobStatusGateway, QueueService],
  imports: [HttpModule]
})
export class AppModule {
}
