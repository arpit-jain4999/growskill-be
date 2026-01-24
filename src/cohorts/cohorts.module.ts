import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CohortsController } from './cohorts.controller';
import { AdminCohortsController } from './admin-cohorts.controller';
import { CohortsService } from './cohorts.service';
import { CohortRepository } from './repositories/cohort.repository';
import { Cohort, CohortSchema } from './schemas/cohort.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cohort.name, schema: CohortSchema }]),
  ],
  controllers: [CohortsController, AdminCohortsController],
  providers: [CohortsService, CohortRepository],
  exports: [CohortsService],
})
export class CohortsModule {}

