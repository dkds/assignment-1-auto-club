import { Process, Processor } from '@nestjs/bull';
import { HttpService } from '@nestjs/common';
import { Job } from 'bull';
import { Workbook } from 'exceljs';
import { DateTime } from 'luxon';
import { delay, map, mergeAll, mergeMap, tap, toArray } from 'rxjs/operators';
import { GraphQLService } from 'src/core/service/graphql.service';
import { BufferedFile } from '../minio-client/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';
import { ExportProgressService } from './export-progress.service';

@Processor('queue-member-export')
export class MemberExportProcessor {

  constructor(
    private minioClient: MinioClientService,
    private graphqlService: GraphQLService,
    private exportProgress: ExportProgressService) { }

  @Process()
  async process(job: Job<{ jobId: string, criteria: any, variables: any }>) {
    const jobId = job.data.jobId;
    const criteria = job.data.criteria;
    const variables = job.data.variables;

    console.log('processing', 'queue-member-export', jobId, criteria, variables);

    const members = await this.graphqlService.getMembersByQuery(criteria, variables)
      .pipe(
        tap((data) => {
          this.exportProgress.init(jobId, data.length);
        }),
        mergeAll(),
        map((member: any) => {
          member.carMake = member.carModel.carMake.name;
          member.carModel = member.carModel.name;
          delete member.__typename;
          return member;
        }),
        delay(200),
        tap(() => {
          this.exportProgress.increment(jobId);
        }),
        toArray()
      )
      .toPromise();

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet();
    console.log("members", members[0], worksheet.rowCount);

    worksheet.columns = [
      { header: 'Id', key: 'id' },
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'Email', key: 'email' },
      { header: 'VIN', key: 'vin' },
      { header: 'Manufactured Date', key: 'mfd' },
      { header: 'Make', key: 'carMake' },
      { header: 'Model', key: 'carModel' }
    ];

    worksheet.addRows(members);
    console.log(worksheet.rowCount);

    const buffer: any = await workbook.csv.writeBuffer({ sheetName: "sheet1" });
    const bufferedFile: BufferedFile = {
      originalname: `${jobId}.csv`,
      mimetype: 'text/csv',
      buffer,
    };
    const response = await this.minioClient.upload(bufferedFile);

    const returnValue = { jobId, ...response };
    console.log('return - ', 'queue-member-export', returnValue);

    this.exportProgress.finish(jobId, returnValue);

    return returnValue;
  }
}
