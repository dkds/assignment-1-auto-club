import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { from, of, throwError } from 'rxjs';
import { mergeMap, tap, toArray } from 'rxjs/operators';
import { DataRow } from 'src/core/model/data-row.model';
import { GraphQLService } from '../core/service/graphql.service';

@Processor('queue-member-import')
export class MemberImportWorker {
  private readonly logger = new Logger(MemberImportWorker.name);

  constructor(
    private graphqlService: GraphQLService) { }

  @Process({ concurrency: 10 })
  async process(job: Job<{ jobId: string, index: number, members: DataRow[] }>) {

    const jobId = job.data.jobId;
    const index = job.data.index;
    const members = job.data.members;
    this.logger.log(`processing ${job.queue.name}, ${jobId}, ${index}`);

    await from(members)
      .pipe(
        mergeMap((member: DataRow) => {
          return this.graphqlService.createOrGetCarMake(member.carMake)
            .pipe(
              mergeMap((carMake: any) => {
                if (carMake.error) {
                  return throwError(`Failed to create car make: ${member.carMake}`);
                }
                member.carMake = carMake;
                return of(member);
              }),
            )
        }),
        mergeMap((member: any) => {
          return this.graphqlService.createOrGetCarModel(member.carModel, member.carMake.id)
            .pipe(
              mergeMap((carModel: any) => {
                if (carModel.error) {
                  return throwError(`Failed to create car model: ${member.carModel}`);
                }
                member.carModel = carModel;
                return of(member);
              }),
            )
        }),
        mergeMap((member: any, index: number) => {
          return this.graphqlService.getMember(member.firstName, member.lastName, member.vin)
            .pipe(
              mergeMap((data: any) => {
                if (data.error) {
                  return from(this.graphqlService.createMember({ ...member, carModelId: member.carModel.id }))
                    .pipe(
                      tap((data: any) => {
                        if (data.error) throw new Error(`Failed to create member: ${member.firstName} ${member.lastName}`);
                      })
                    );
                }
                return of([index, data]);
              }),
            )
        }),
        tap(([index]) => {
          job.progress(++index);
        }),
        toArray()
      ).toPromise();

    const returnValue = { index };
    this.logger.log(`completed queue-member-import, ${returnValue.index}`);

    return returnValue;
  }
}
