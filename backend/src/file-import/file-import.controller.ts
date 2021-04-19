import { InjectQueue } from '@nestjs/bull';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { BufferedFile } from '../core/model/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';

@Controller()
export class FileImportController {

  constructor(
    private minioClient: MinioClientService,
    @InjectQueue('queue-file-read') private fileReadQueue: Queue) { }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: BufferedFile) {
    console.log('file', file);
    const response = await this.minioClient.upload(file);
    console.log('response', response, 'queue-file-read', this.fileReadQueue);

    await this.fileReadQueue.add({ jobId: response.name, ...response }, { delay: 5000 });

    return { jobId: response.name };
  }
}
