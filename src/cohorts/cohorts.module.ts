import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CohortsController } from './cohorts.controller';
import { AdminCohortsController } from './admin-cohorts.controller';
import { CohortsService } from './cohorts.service';
import { CohortRepository } from './repositories/cohort.repository';
import { Cohort, CohortSchema } from './schemas/cohort.schema';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cohort.name, schema: CohortSchema }]),
    OrganizationsModule,
    PermissionsModule,
  ],
  controllers: [CohortsController, AdminCohortsController],
  providers: [CohortsService, CohortRepository],
  exports: [CohortsService],
})
export class CohortsModule {}

