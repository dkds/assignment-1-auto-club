import { HttpModule, Module } from '@nestjs/common';
import { MinioClientModule } from './minio-client/minio-client.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { FileImportModule } from './file-import/file-import.module';
import { FileExportModule } from './file-export/file-export.module';

@Module({
  providers: [
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env['REDIS_HOST'],
        port: +process.env['REDIS_PORT'],
      },
    }),
    HttpModule,
    MinioClientModule,
    FileImportModule,
    FileExportModule,
  ]
})
export class AppModule {
}
