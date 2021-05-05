import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ImportProgressService {
  private readonly logger = new Logger(ImportProgressService.name);

  private jobProgress: { [jobId: string]: { total: number, completed: number } } = {};

  constructor(
    @InjectQueue('queue-member-import-progress') private memberImportProgress: Queue) {
  }

  init(jobId: string, total: number) {
    this.jobProgress[jobId] = { total, completed: 0 };
    this.logger.log(`jobProgress init, ${jobId}, ${total}, ${this.jobProgress}`);
    this.memberImportProgress.add({ jobId, ...this.jobProgress[jobId] })
  }

  increment(jobId: string) {
    const progressDetails = this.jobProgress[jobId];
    progressDetails.completed++;
    this.logger.log(`jobProgress update, ${jobId}, ${progressDetails}`);
    this.memberImportProgress.add({ jobId, ...progressDetails })
  }
}
