import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { S3StorageService } from './s3-storage.service';
import { FileRepository } from './repositories/file.repository';
import { FileInfo, FileInfoSchema } from '../common/schemas/file.schema';
import { VideoProcessingModule } from '../video-processing/video-processing.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileInfo.name, schema: FileInfoSchema },
    ]),
    HttpModule,
    forwardRef(() => VideoProcessingModule),
  ],
  controllers: [FilesController],
  providers: [S3StorageService, FilesService, FileRepository],
  exports: [FilesService, FileRepository, S3StorageService],
})
export class FilesModule {}

