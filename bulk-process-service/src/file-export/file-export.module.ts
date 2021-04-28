import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { ApolloService } from 'src/core/service/apollo.service';
import { GraphQLService } from 'src/core/service/graphql.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { ExportProgressService } from './export-progress.service';
import { MemberExportProcessor } from './member-export.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'queue-member-export' },
      { name: 'queue-member-export-progress' },
    ),
    MinioClientModule,
    HttpModule,
  ],
  providers: [
    ApolloService,
    GraphQLService,
    MemberExportProcessor,
    ExportProgressService,
  ]
})
export class FileExportModule {
}
