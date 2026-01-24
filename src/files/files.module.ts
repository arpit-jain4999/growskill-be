import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileRepository } from './repositories/file.repository';
import { FileInfo, FileInfoSchema } from '../common/schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileInfo.name, schema: FileInfoSchema },
    ]),
    HttpModule,
  ],
  controllers: [FilesController],
  providers: [FilesService, FileRepository],
  exports: [FilesService],
})
export class FilesModule {}

