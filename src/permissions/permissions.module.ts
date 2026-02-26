import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgPermission, OrgPermissionSchema } from './schemas/org-permission.schema';
import { UserPermission, UserPermissionSchema } from './schemas/user-permission.schema';
import { OrgPermissionRepository } from './repositories/org-permission.repository';
import { UserPermissionRepository } from './repositories/user-permission.repository';
import { PermissionsService } from './permissions.service';
import { AdminPermissionsController } from './admin-permissions.controller';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { PERMISSIONS_SERVICE } from '../common/guards/authorize.guard';
import { CommonModule } from '../common/common.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    CommonModule,
    forwardRef(() => OrganizationsModule),
    MongooseModule.forFeature([
      { name: OrgPermission.name, schema: OrgPermissionSchema },
      { name: UserPermission.name, schema: UserPermissionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminPermissionsController],
  providers: [
    OrgPermissionRepository,
    UserPermissionRepository,
    PermissionsService,
    { provide: PERMISSIONS_SERVICE, useExisting: PermissionsService },
  ],
  exports: [
    PermissionsService,
    PERMISSIONS_SERVICE,
    OrgPermissionRepository,
    UserPermissionRepository,
  ],
})
export class PermissionsModule {}
