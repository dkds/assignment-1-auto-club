import { create } from 'socketcluster-client';

export class ImportJobStatusSCClient {

  socket: any;

  constructor() {
    this.socket = create({
      hostname: process.env['SOCKETCLUSTER_HOST'],
      port: +process.env['SOCKETCLUSTER_PORT'],
    });
  }

  notifyFinish(jobId: string, data?: any) {
    this.notify(jobId, `job-finished/export`, { jobId, data });
  }

  notifyProgress(jobId: string, progress: number, data?: any) {
    this.notify(jobId, "job-progress/export", { jobId, progress, data });
  }

  private notify(jobId: string, event: string, data: any) {
    this.socket.transmitPublish(`${event}/${jobId}`, data);
  }
}
