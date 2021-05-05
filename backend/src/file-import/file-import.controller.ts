import { InjectQueue } from '@nestjs/bull';
import { Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { BufferedFile } from '../core/model/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';

@Controller('import')
export class FileImportController {
  private readonly logger = new Logger(FileImportController.name);

  constructor(
    private minioClient: MinioClientService,
    @InjectQueue('queue-file-read') private fileReadQueue: Queue) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: BufferedFile) {
    const response = await this.minioClient.upload(file);

    await this.fileReadQueue.add({ jobId: response.name, ...response }, { delay: 5000 });
    this.logger.log(`added to queue-file-read, ${response.name}`);

    return { jobId: response.name };
  }
}
