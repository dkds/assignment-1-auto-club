import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ExportJobStatusGateway } from './export-job-status.gateway';

@Processor('queue-member-export-progress')
export class MemberExportProgressProcessor {

  constructor(private jobStatusGateway: ExportJobStatusGateway) { }

  @Process()
  async process(job: Job<{ jobId: string, total: number, completed: number }>) {
    const jobId = job.data.jobId;
    const total = job.data.total;
    const completed = job.data.completed;
    const progress = ((completed / total) * 100).toFixed(1);

    this.jobStatusGateway.notifyProgress(jobId, +progress);

    if (+progress >= 99.9) {
      this.jobStatusGateway.notifyFinish(jobId, { progress });
    }
  }
}
