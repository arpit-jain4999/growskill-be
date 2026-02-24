import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import {
  OrganizationModule as OrgModuleEntity,
  OrganizationModuleSchema,
} from './schemas/organization-module.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
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
