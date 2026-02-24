import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChaptersController } from './chapters.controller';
import { AdminChaptersController } from './admin-chapters.controller';
import { ChaptersService } from './chapters.service';
import { ChapterRepository } from './repositories/chapter.repository';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    OrganizationsModule,
  ],
  controllers: [ChaptersController, AdminChaptersController],
  providers: [ChaptersService, ChapterRepository],
  exports: [ChaptersService],
})
export class ChaptersModule {}
