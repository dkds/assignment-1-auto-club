import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { config } from './minio.config'
import { BufferedFile } from '../core/model/file.model';
import { getRandomCode } from '../core/util';
import { Stream } from 'stream';

@Injectable()
export class MinioClientService {
    private readonly baseBucket = config.MINIO_BUCKET

    public get client() {
        return this.minio.client;
    }

    constructor(private readonly minio: MinioService) {
    }

    public async get(fileName: string, baseBucket: string = this.baseBucket): Promise<Stream> {
        return new Promise((resolve, reject) => {
            this.client.getObject(baseBucket, fileName, (err, dataStream) => {
                if (err) {
                    console.log(err);
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
        let fileName = getRandomCode();
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        const metaData = {
            'Content-Type': file.mimetype,
            'X-Amz-Meta-Testing': 1234,
        };
        const fullName = fileName + ext;
        console.log(fullName);
        const fileBuffer = file.buffer;
        await this.client.putObject(baseBucket, fullName, fileBuffer, metaData);

        return {
            name: fileName,
            fileName: fullName,
            url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${fullName}`
        }
    }

    async delete(objetName: string, baseBucket: string = this.baseBucket) {
        this.client.removeObject(baseBucket, objetName, function (err, res) {
            if (err) throw new HttpException("Oops Something wrong happend", HttpStatus.BAD_REQUEST)
        })
    }
}