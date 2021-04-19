import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Queue } from 'bull';
import { Response } from 'express';
import { getRandomCode } from 'src/core/util';
import { MinioClientService } from '../minio-client/minio-client.service';

const EXPORT_CRITERIA = [
  {
    code: 'default',
    text: 'Default'
  },
  {
    code: 'by-age',
    text: 'By Age'
  }
]

@Controller('export')
export class FileExportController {

  constructor(
    private minioClient: MinioClientService,
    @InjectQueue('queue-member-export') private memberExportQueue: Queue) { }

  @Get('criteria')
  async listCriteria() {
    return EXPORT_CRITERIA;
  }

  @Post('request')
  async requestExport(
    @Body('criteria') criteria: string,
    @Body('variables') variables: string) {
    const code = getRandomCode();
    await this.memberExportQueue.add({ jobId: code, criteria, variables });
    return { jobId: code };
  }

  @Post('download')
  async downloadFile(
    @Body('jobId') jobId: string,
    @Body('ext') ext: string = 'csv',
    @Res() res: Response) {
    try {
      const stream = await this.minioClient.get(`${jobId}.${ext}`);
      return stream.pipe(res);
    } catch (e) {
      console.error(e);
    }
  }
}
