import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard } from '../common/guards/tenant-context.guard';
import { RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { AuthorizeGuard } from '../common/guards/authorize.guard';
import { Authorize } from '../common/decorators/authorize.decorator';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { assertSameOrg } from '../common/helpers/assert-same-org';
import { Actor } from '../common/types/actor';
import { ROLES } from '../common/constants/roles';
import { PERMISSIONS } from '../common/constants/permissions';
import { normalizeCountryCode, normalizePhoneNumber } from '../common/helpers/phone';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { OrganizationsService } from './organizations.service';
import { PermissionsService } from '../permissions/permissions.service';

@ApiTags('Org Admin')
@Controller('v1/org')
@UseGuards(JwtAuthGuard, TenantContextGuard, RequireTenantGuard)
@ApiBearerAuth('JWT-auth')
export class OrgAdminController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private organizationsService: OrganizationsService,
    private permissionsService: PermissionsService,
  ) {}

  @Post('users')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.USER_CREATE)
  @ApiOperation({ summary: 'Create user in org' })
  async createUser(
    @Body() body: { email?: string; name?: string; countryCode: string; phoneNumber: string },
    @CurrentActor() actor: Actor,
  ) {
    const organizationId = actor.organizationId!;
    const user = await this.userModel.create({
      organizationId: new Types.ObjectId(organizationId),
      email: body.email,
      name: body.name,
      countryCode: normalizeCountryCode(body.countryCode),
      phoneNumber: normalizePhoneNumber(body.phoneNumber),
      role: ROLES.USER,
      isVerified: false,
    });
    return user;
  }

  @Patch('users/:userId/role')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.USER_ASSIGN_ROLE_ADMIN)
  @ApiOperation({ summary: 'Promote/demote user role (SUPER_ADMIN only for ADMIN)' })
  async setUserRole(
    @Param('userId') userId: string,
    @Body() body: { role: string },
    @CurrentActor() actor: Actor,
  ) {
    const target = await this.userModel.findById(userId);
    if (!target) throw new ForbiddenException('User not found');
    assertSameOrg(target.organizationId?.toString(), actor.organizationId);

    if (body.role === ROLES.ADMIN) {
      if (actor.role !== ROLES.SUPER_ADMIN) {
        throw new ForbiddenException('Only SUPER_ADMIN can assign ADMIN role');
      }
    } else if (body.role === ROLES.SUPER_ADMIN) {
      const existing = await this.userModel.findOne({
        organizationId: target.organizationId,
        role: ROLES.SUPER_ADMIN,
      });
      if (existing && existing._id.toString() !== userId) {
        throw new ForbiddenException('Organization already has a SUPER_ADMIN');
      }
    }

    target.role = body.role as any;
    await target.save();
    return target;
  }

  @Post('permissions/grant')
  @UseGuards(AuthorizeGuard)
  @Authorize(PERMISSIONS.PERMISSION_GRANT)
  @ApiOperation({ summary: 'Grant permissions to user (delegates to PermissionsService)' })
  async grantPermission(
    @Body() body: { userId: string; permissions: string[] },
    @CurrentActor() actor: Actor,
  ) {
    return this.permissionsService.grantToUser(
      actor.organizationId!,
      body.userId,
      body.permissions,
      actor.userId,
    );
  }

  @Post('modules/enable')
  @ApiOperation({ summary: 'Enable module for org (SUPER_ADMIN or PLATFORM_OWNER)' })
  async enableModule(
    @Body() body: { moduleKey: string },
    @CurrentActor() actor: Actor,
  ) {
    if (actor.role !== ROLES.SUPER_ADMIN && actor.role !== ROLES.PLATFORM_OWNER) {
      throw new ForbiddenException('SUPER_ADMIN or PLATFORM_OWNER required');
    }
    const orgId = actor.organizationId!;
    await this.organizationsService.enableModule(
      orgId,
      body.moduleKey,
      actor.userId,
    );
    return { enabled: body.moduleKey };
  }

  @Get('modules')
  @ApiOperation({ summary: 'List enabled modules for current org' })
  async listModules(@CurrentActor() actor: Actor) {
    const orgId = actor.organizationId!;
    const keys = await this.organizationsService.getEnabledModules(orgId);
    return { modules: keys };
  }
}
