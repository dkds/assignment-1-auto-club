import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { Queue } from 'bull';
import { Response } from 'express';
import { getRandomCode } from 'src/core/util';
import { MinioClientService } from '../minio-client/minio-client.service';
import { EXPORT_CRITERIA } from './export.criteria';

@Controller('export')
export class FileExportController {
  private readonly logger = new Logger(FileExportController.name);

  constructor(
    private minioClient: MinioClientService,
    @InjectQueue('queue-member-export') private memberExportQueue: Queue) { }

  @Get('criteria')
  async listCriteria() {
    return EXPORT_CRITERIA.map((criteria) => {
      const exportCriteria = { ...criteria }
      delete exportCriteria.query;
      return exportCriteria;
    });
  }

  @Post('request')
  async requestExport(
    @Body('criteria') code: string,
    @Body('variables') variables: string) {
    const jobId = getRandomCode();
    const query = EXPORT_CRITERIA.find(criteria => criteria.code == code)?.query;
    await this.memberExportQueue.add({ jobId, criteria: query, variables }, { delay: 3000 });
    return { jobId };
  }

  @Get('download/:jobId/:ext')
  async downloadFile(
    @Param('jobId') jobId: string,
    @Param('ext') ext: string = 'csv',
    @Res() res: Response) {
    try {
      const stream = await this.minioClient.get(`${jobId}.${ext}`);
      res.setHeader("Content-Disposition", `attachment; filename=member-export.${ext};`)
      return stream.pipe(res);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
