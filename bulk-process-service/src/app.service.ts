import { Injectable } from '@nestjs/common';
import { Queue, Worker, Job, QueueScheduler } from 'bullmq';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GraphqlService } from './graphql/graphql.service';

@Injectable()
export class AppService {

  private queueName = 'test-queue-color';
  private redis = {
    connection: {
      host: "redis-11120.c233.eu-west-1-1.ec2.cloud.redislabs.com",
      port: 11120,
      password: "Hwx3yzN4WOXm9xRQNQtRmOlmPYG004Hv"
    }
  };

  constructor(private readonly graphqlService: GraphqlService) {
    new Queue(this.queueName, this.redis)
    new QueueScheduler(this.queueName, this.redis);
    new Worker(this.queueName, async (job: Job) => {

      console.log('processing', job.data.nameCode, job.data.row.id);

      let carMake = await this.graphqlService.getCarMake(job.data.row.carMake)
        .pipe(
          mergeMap((data: any) => {
            if (data.error) {
              return this.graphqlService.createCarMake(job.data.row.carMake);
            }
            return of(data);
          }))
        .toPromise();
      console.log('carMake - ', carMake);

      let carModel = await this.graphqlService.getCarModel(job.data.row.carModel, carMake.id)
        .pipe(
          mergeMap((data: any) => {
            if (data.error) {
              return this.graphqlService.createCarModel(job.data.row.carModel, carMake.id);
            }
            return of(data);
          }))
        .toPromise();
      console.log('carModel - ', carModel);

      let member = await this.graphqlService.getMember(job.data.row.firstName, job.data.row.lastName, job.data.row.vinNumber)
        .pipe(
          mergeMap((data: any) => {
            if (data.error) {
              return this.graphqlService.createMember({ ...job.data.row, carModelId: carModel.id });
            }
            return of(data);
          }))
        .toPromise();
      console.log('member - ', member.firstName, member.lastName);

      const returnValue = { nameCode: job.data.nameCode };
      console.log('return - ', returnValue);

      return returnValue;
    }, { ...this.redis });
  }
}
