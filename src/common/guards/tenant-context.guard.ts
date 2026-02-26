import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Optional,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Actor } from '../types/actor';
import { ROLES } from '../constants/roles';

export const TENANT_RESOLVER = 'TENANT_RESOLVER';

/** Default org id when x-org-id header is not sent (e.g. for PLATFORM_OWNER). Remove when clients send the header. */
export const DEFAULT_X_ORG_ID = '698b0f6076ca77d98d706e65';

export interface ITenantResolver {
  resolveOrgId(headerValue: string | undefined): Promise<string | null>;
}

/**
 * Sets request.actor from request.user (JWT payload).
 * When the user is PLATFORM_OWNER and x-org-id header is present, uses the optional
 * TENANT_RESOLVER to resolve a valid org id so the actor gets tenant context.
 * Run after JwtAuthGuard. For tenant-scoped routes, use RequireTenantGuard after this.
 */
@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Optional()
    @Inject(TENANT_RESOLVER)
    private tenantResolver?: ITenantResolver,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true; // Let auth guard handle missing user

    let organizationId: string | null = user.organizationId ?? null;
    if (
      !organizationId &&
      user.role === 'PLATFORM_OWNER' &&
      this.tenantResolver
    ) {
      const headerValue =
        request.headers?.['x-org-id'] ?? request.headers?.['X-Org-Id'];
      const effectiveOrgId = headerValue?.trim() || DEFAULT_X_ORG_ID;
      organizationId = await this.tenantResolver.resolveOrgId(effectiveOrgId);
    }

    const actor: Actor = {
      userId: user.userId ?? user.sub,
      organizationId,
      role: user.role ?? 'USER',
      permissions: user.permissions ?? [],
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
    };
    request.actor = actor;
    return true;
  }
}

/**
 * Use on tenant-scoped routes: requires actor to have an organizationId.
 * PLATFORM_OWNER is always allowed through (all permissions enabled by default);
 * handlers that need org must check actor.organizationId and return 400 if missing.
 */
@Injectable()
export class RequireTenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const actor: Actor | undefined = request.actor;
    if (!actor) {
      throw new ForbiddenException('Tenant context required for this action');
    }
    if (actor.role === ROLES.PLATFORM_OWNER) {
      return true;
    }
    if (!actor.organizationId) {
      throw new ForbiddenException('Tenant context required for this action');
    }
    return true;
  }
}
