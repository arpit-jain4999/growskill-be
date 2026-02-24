import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Optional,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../constants/roles';
import { type Actor } from '../types/actor';
import { AUTHORIZE_PERMISSION_KEY } from '../decorators/authorize.decorator';

export const PERMISSIONS_SERVICE = 'PERMISSIONS_SERVICE';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Optional()
    @Inject(PERMISSIONS_SERVICE)
    private permissionsService?: { hasPermission(actor: Actor, permission: string): Promise<boolean> },
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      AUTHORIZE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const actor: Actor | undefined = request.actor;
    if (!actor) {
      throw new ForbiddenException('Unauthorized');
    }
    if (actor.role === ROLES.PLATFORM_OWNER) {
      return true;
    }
    const hasIt = this.permissionsService
      ? await this.permissionsService.hasPermission(actor, requiredPermission)
      : (actor.permissions ?? []).includes(requiredPermission);
    if (!hasIt) {
      throw new ForbiddenException(
        `Missing required permission: ${requiredPermission}`,
      );
    }
    return true;
  }
}
