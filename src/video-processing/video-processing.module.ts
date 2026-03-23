import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoProcessing, VideoProcessingSchema } from './schemas/video-processing.schema';
import { VideoProcessingRepository } from './repositories/video-processing.repository';
import { VideoProcessingService } from './video-processing.service';
import { VideoProcessingController } from './video-processing.controller';
import { FilesModule } from '../files/files.module';
import { ChaptersModule } from '../chapters/chapters.module';
import { ModulesModule } from '../modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoProcessing.name, schema: VideoProcessingSchema },
    ]),
    forwardRef(() => FilesModule),
    ChaptersModule,
    ModulesModule,
  ],
  controllers: [VideoProcessingController],
  providers: [VideoProcessingRepository, VideoProcessingService],
  exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
