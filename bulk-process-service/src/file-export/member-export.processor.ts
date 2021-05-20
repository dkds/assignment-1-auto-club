import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Workbook } from 'exceljs';
import { delay, map, mergeAll, tap, toArray } from 'rxjs/operators';
import { GraphQLService } from 'src/core/service/graphql.service';
import { BufferedFile } from '../minio-client/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';

@Processor('queue-member-export')
export class MemberExportProcessor {
  private readonly logger = new Logger(MemberExportProcessor.name);

  constructor(
    private minioClient: MinioClientService,
    private graphqlService: GraphQLService) { }

  @Process()
  async process(job: Job<{ jobId: string, criteria: any, variables: any }>) {
    const jobId = job.data.jobId;
    const criteria = job.data.criteria;
    const variables = job.data.variables;

    this.logger.log(`processing queue-member-export, ${jobId}, ${criteria}, ${variables}`);

    const members = await this.graphqlService.getMembersByQuery(criteria, variables)
      .pipe(
        tap(() => {
          job.progress({ jobId, progress: 0 });
        }),
        mergeAll(),
        map((member: any, index: number) => {
          member.carMake = member.carModel.carMake.name;
          member.carModel = member.carModel.name;
          delete member.__typename;
          return { member, index };
        }),
        delay(200),
        tap(() => {
          job.progress({ jobId, progress: 20 });
        }),
        toArray()
      )
      .toPromise();

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet();

    job.progress({ jobId, progress: 40 });

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
    this.logger.log(`worksheet: ${worksheet.rowCount}`);

    job.progress({ jobId, progress: 60 });
    const buffer: any = await workbook.csv.writeBuffer({ sheetName: "sheet1" });
    const bufferedFile: BufferedFile = {
      originalname: `${jobId}.csv`,
      mimetype: 'text/csv',
      buffer,
    };
    job.progress({ jobId, progress: 80 });
    await this.minioClient.upload(bufferedFile);

    const returnValue = { jobId };
    this.logger.log(`return queue-member-export, ${returnValue.jobId}`);

    job.progress({ jobId, progress: 100 });

    return returnValue;
  }
}
