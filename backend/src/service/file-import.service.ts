import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Row, Workbook, Worksheet } from 'exceljs';
import { DataRow } from '../model/data-row.model';
import { from } from 'rxjs';
import { mergeMap, pluck, take } from 'rxjs/operators';
import { QueueService } from './queue.service';

@Injectable()
export class FileImportService {

  constructor(private queueService: QueueService) {
  }

  async processFile(path: string, name: string): Promise<{ jobId: string }> {
    console.log(path);
    const readable = fs.createReadStream(path);
    const workbook = new Workbook();
    await workbook.xlsx.read(readable);

    const [data, errors] = this.getData(workbook);
    const nameCode = name.split('.')[0];
    const total = 26;

    console.log(errors);
    console.log(nameCode);

    from(data).pipe(
      take(total),
      mergeMap((row: DataRow) => from(this.queueService.addJob(row, nameCode, total))),
      pluck('data', 'row')
    ).subscribe();

    const response = { jobId: nameCode };

    console.log('response', response);
    return response;
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
