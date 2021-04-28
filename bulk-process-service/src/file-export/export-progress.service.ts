import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ExportProgressService {

  private jobProgress: { [jobId: string]: { total: number, completed: number } } = {};

  constructor(
    @InjectQueue('queue-member-export-progress') private memberExportProgress: Queue) {
  }

  init(jobId: string, total: number) {
    this.jobProgress[jobId] = { total: total++, completed: 0 };
    console.log('jobProgress', 'init', jobId, total, this.jobProgress);
    this.memberExportProgress.add({ jobId, ...this.jobProgress[jobId] })
  }

  increment(jobId: string) {
    const progressDetails = this.jobProgress[jobId];
    progressDetails.completed++;
    this.memberExportProgress.add({ jobId, ...progressDetails })
  }

  finish(jobId: string, returnValue: any) {
    const progressDetails = this.jobProgress[jobId];
    progressDetails.completed = progressDetails.total;
    this.memberExportProgress.add({ jobId, ...progressDetails, returnValue })
  }
}
