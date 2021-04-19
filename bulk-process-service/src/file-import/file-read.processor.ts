import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Row, Workbook, Worksheet } from 'exceljs';
import { bufferCount, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { DataRow } from 'src/core/model/data-row.model';
import { ImportProgressService } from './import-progress.service';

@Processor('queue-file-read')
export class FileReadWorker {

  constructor(
    private minioClient: MinioClientService,
    private importProgress: ImportProgressService,
    @InjectQueue('queue-member-import') private memberImportQueue: Queue) {
  }

  @Process()
  async process(job: Job<{ jobId: string, url: string, fileName: string }>) {
    const jobId = job.data.jobId;
    const url = job.data.url;
    const fileName = job.data.fileName;
    console.log('processing', 'queue-file-read', jobId, url, fileName);

    const stream = await this.minioClient.get(fileName);

    const workbook = new Workbook();
    await workbook.xlsx.read(stream);

    const [data, errors] = this.getData(workbook);
    console.log(errors);

    const rows = data.slice(0, 10);
    console.log('rows', rows.length);

    from(rows)
      .pipe(
        bufferCount(5),
        map((members: DataRow[], index) => {
          return { jobId, members, index: ++index };
        }),
      )
      .subscribe((data) => {
        console.log('members - ', 'data', data.index);
        this.memberImportQueue.add({ ...data }, { delay: 2000 });
      });

    this.importProgress.init(jobId, rows.length);

    const returnValue = { jobId };
    console.log('return - ', 'queue-file-read', returnValue);

    return returnValue;
  }

  private getData(workbook: Workbook): [DataRow[], { rowNumber: number, error: Error }[]] {
    const data: DataRow[] = [];
    const errors: { rowNumber: number, error: Error }[] = [];
    workbook.worksheets.forEach((worksheet: Worksheet) => {
      worksheet.eachRow((row: Row, rowNumber: number) => {
        const rowData = new DataRow();

        try {
          rowData.id = row.values[1];
          rowData.firstName = row.values[2];
          rowData.lastName = row.values[3];
          rowData.email = row.values[4];
          rowData.carMake = row.values[5];
          rowData.carModel = row.values[6];
          rowData.vinNumber = row.values[7];
          rowData.mfd = row.values[8];
          data.push(rowData);
        } catch (error) {
          errors.push({ rowNumber, error })
        }
      })
    });
    return [data.splice(1), errors];
  }
}
