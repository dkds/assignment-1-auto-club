import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ImportJobStatusSCClient } from './export-job-status-sc.client';

@Processor('queue-member-export-progress')
export class MemberExportProgressProcessor {

  constructor(private jobStatusGateway: ImportJobStatusSCClient) { }

  @Process()
  async process(job: Job<{ jobId: string, total: number, completed: number, returnValue: any }>) {
    const jobId = job.data.jobId;
    const total = job.data.total;
    const completed = job.data.completed;
    const returnValue = job.data.returnValue;
    const progress = ((completed / total) * 100).toFixed(1);

    this.jobStatusGateway.notifyProgress(jobId, +progress);

    if (returnValue) {
      this.jobStatusGateway.notifyFinish(jobId, { progress });
    }
  }
}
