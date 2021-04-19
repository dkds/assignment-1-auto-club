import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { from, of } from 'rxjs';
import { mergeMap, tap, toArray } from 'rxjs/operators';
import { DataRow } from 'src/core/model/data-row.model';
import { GraphQLService } from '../core/service/graphql.service';
import { ImportProgressService } from './import-progress.service';

@Processor('queue-member-import')
export class MemberImportWorker {

  constructor(
    private graphqlService: GraphQLService,
    private importProgress: ImportProgressService) { }

  @Process()
  async process(job: Job<{ jobId: string, index: number, members: DataRow[] }>) {

    const jobId = job.data.jobId;
    const index = job.data.index;
    const members = job.data.members;

    console.log('processing', 'queue-member-import', jobId, index);

    await from(members).pipe(
      mergeMap((member: DataRow) => {
        return this.graphqlService.getCarMake(member.carMake)
          .pipe(
            mergeMap((carMake: any) => {
              if (carMake.error) {
                return this.graphqlService.createCarMake(member.carMake);
              }
              return of(carMake);
            }),
            mergeMap((carMake: any) => {
              member.carMake = carMake;
              return of(member);
            })
          )
      }),
      mergeMap((member: any) => {
        return this.graphqlService.getCarModel(member.carModel, member.carMake.id)
          .pipe(
            mergeMap((carModel: any) => {
              if (carModel.error) {
                return this.graphqlService.createCarModel(member.carModel, member.carMake.id);
              }
              return of(carModel);
            }),
            mergeMap((carModel: any) => {
              member.carModel = carModel;
              return of(member);
            })
          )
      }),
      mergeMap((member: any) => {
        return this.graphqlService.getMember(member.firstName, member.lastName, member.vinNumber)
          .pipe(
            mergeMap((member: any) => {
              if (member.error) {
                return this.graphqlService.createMember({ ...member, carModelId: member.carModel.id });
              }
              return of(member);
            })
          )
      }),
      tap(() => {
        this.importProgress.increment(jobId);
      }),
      toArray()
    ).toPromise();

    // this.importProgress.update(jobId, members.length);

    const returnValue = { index };
    console.log('return - ', 'queue-member-import', returnValue);

    return returnValue;
  }
}
