import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ImportJobStatusSCClient } from './import-job-status-sc.client';

@Processor('queue-member-import-progress')
export class MemberImportProgressProcessor {

  constructor(
    private jobStatusGateway: ImportJobStatusSCClient) { }

  @Process()
  async process(job: Job<{ jobId: string, total: number, completed: number }>) {
    const jobId = job.data.jobId;
    const total = job.data.total;
    const completed = job.data.completed;
    const progress = ((completed / total) * 100).toFixed(1);

    this.jobStatusGateway.notifyProgress(jobId, +progress);

    if (+progress >= 99.9) {
      this.jobStatusGateway.notifyFinish(jobId, { progress })
    }
  }
}
