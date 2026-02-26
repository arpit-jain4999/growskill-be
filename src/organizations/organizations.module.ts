import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import {
  OrganizationModule as OrgModuleEntity,
  OrganizationModuleSchema,
} from './schemas/organization-module.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { Cohort, CohortSchema } from '../cohorts/schemas/cohort.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import { Module as ContentModule, ModuleSchema as ContentModuleSchema } from '../modules/schemas/module.schema';
import { Chapter, ChapterSchema } from '../chapters/schemas/chapter.schema';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationModuleRepository } from './repositories/organization-module.repository';
import { OrganizationsService } from './organizations.service';
import { TenantResolutionService } from './tenant-resolution.service';
import { PlatformController } from './platform.controller';
import { OrgAdminController } from './org-admin.controller';
import { AuthorizeGuard } from '../common/guards/authorize.guard';
import { PERMISSIONS_SERVICE } from '../common/guards/authorize.guard';
import {
  TenantContextGuard,
  TENANT_RESOLVER,
} from '../common/guards/tenant-context.guard';
import { CommonModule } from '../common/common.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    CommonModule,
    PermissionsModule,
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: OrgModuleEntity.name, schema: OrganizationModuleSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Cohort.name, schema: CohortSchema },
      { name: Course.name, schema: CourseSchema },
      { name: ContentModule.name, schema: ContentModuleSchema },
      { name: Chapter.name, schema: ChapterSchema },
    ]),
  ],
  controllers: [PlatformController, OrgAdminController],
  providers: [
    OrganizationRepository,
    OrganizationModuleRepository,
    OrganizationsService,
    TenantResolutionService,
    { provide: TENANT_RESOLVER, useExisting: TenantResolutionService },
    TenantContextGuard,
    AuthorizeGuard,
  ],
  exports: [
    OrganizationsService,
    OrganizationRepository,
    OrganizationModuleRepository,
    TenantContextGuard,
  ],
})
export class OrganizationsModule {}
