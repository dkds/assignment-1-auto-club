import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileImportService } from '../service/file-import.service';
import { editFileName as generateFileName, excelFileFilter } from '../common/util';

@Controller()
export class FileImportController {

  constructor(private readonly appService: FileImportService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './files',
      filename: generateFileName,
    }),
    fileFilter: excelFileFilter,
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.appService.processFile(file.path, file.filename);
  }
}
