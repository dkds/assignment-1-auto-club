import { OnGlobalQueueCompleted, OnGlobalQueueProgress, Processor } from '@nestjs/bull';
import { ImportJobStatusSCClient } from './export-job-status-sc.client';

@Processor('queue-member-export')
export class MemberExportProgressProcessor {

  constructor(private jobStatusGateway: ImportJobStatusSCClient) { }

  @OnGlobalQueueProgress()
  progress(_id: any, { jobId, progress }: { jobId: string, progress: number }) {
    this.jobStatusGateway.notifyProgress(jobId, +progress);
  }

  @OnGlobalQueueCompleted()
  complete(_id: any, result: string) {
    this.jobStatusGateway.notifyFinish(JSON.parse(result).jobId, { progress: 100 })
  }
}
