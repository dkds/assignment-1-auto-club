import { Injectable } from '@nestjs/common';
import { Job, Queue, QueueEvents } from 'bullmq';
import { DataRow } from 'src/model/data-row.model';
import { JobStatusGateway } from '../gateway/job-status.gateway';

@Injectable()
export class QueueService {

    private queueName = 'test-queue-color';
    private redis = {
        connection: {
            host: "redis-11120.c233.eu-west-1-1.ec2.cloud.redislabs.com",
            port: 11120,
            password: "Hwx3yzN4WOXm9xRQNQtRmOlmPYG004Hv"
        }
    };
    private queue = new Queue(this.queueName, this.redis);
    private queueEvents = new QueueEvents(this.queueName, this.redis);
    private jobInfo: { [name: string]: { total: number, completed: number } } = {};

    constructor(private jobStatusGateway: JobStatusGateway) {
        this.queueEvents.on('completed', job => {
            const jobId = job.returnvalue['nameCode'];
            const progressData = this.jobInfo[jobId];
            progressData.completed++;
            const progress = ((progressData.completed / progressData.total) * 100).toFixed(1);

            console.log('completed', jobId, progressData, progress, '%');
            jobStatusGateway.notifyProgress(jobId, +progress);
            if (+progress >= 99.9) {
                jobStatusGateway.notifyFinish(jobId, { progress })
            }
        });
    }

    addJob(row: DataRow, nameCode: string, total: number): Promise<Job<any, any, string>> {
        this.jobInfo[nameCode] = { total, completed: 0 };
        return this.queue.add('row-processor', { row, nameCode, total }, { delay: 5000 });
    }
}
