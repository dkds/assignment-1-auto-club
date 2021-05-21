import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import { Stream } from 'stream';

@Injectable()
export class MinioClientService {
  private readonly logger = new Logger(MinioClientService.name);
  private readonly baseBucket = process.env['MINIO_BUCKET'];

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    minio.client.bucketExists(this.baseBucket, (err, exists) => {
      if (err) {
        this.logger.error(err);
        return;
      }
      if (exists) {
        this.logger.log(`Bucket found successfully: ${this.baseBucket}`);
      } else {
        minio.client.makeBucket(this.baseBucket, (err) => {
          if (err) {
            this.logger.error(`Error creating bucket: ${this.baseBucket}, ${err}`);
            return;
          } else {
            this.logger.log(`Bucket created successfully: ${this.baseBucket}`);
          }
        })
      }
    });
  }

  public async get(fileName: string, baseBucket: string = this.baseBucket): Promise<Stream> {
    return new Promise((resolve, reject) => {
      this.client.getObject(baseBucket, fileName, (err, dataStream) => {
        if (err) {
          this.logger.error(err);
          reject(err);
        }
        resolve(dataStream);
      });
    });
  }

  public async upload(file: BufferedFile, baseBucket: string = this.baseBucket) {
    if (!(file.mimetype.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      || file.mimetype.includes('text/csv'))) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
    }
    let fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const fullName = fileName + ext;
    const fileBuffer = file.buffer;
    this.client.putObject(baseBucket, fullName, fileBuffer, metaData, (err, res) => {
      if (err) {
        throw new HttpException('Error uploading file', err);
      }
    });

    return {
      name: fileName,
      fileName: fullName,
      url: `${process.env['MINIO_ENDPOINT']}:${process.env['MINIO_PORT']}/${process.env['MINIO_BUCKET']}/${fullName}`
    }
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objetName, function (err, res) {
      if (err) throw new HttpException("Oops Something wrong happend", HttpStatus.BAD_REQUEST)
    })
  }
}
