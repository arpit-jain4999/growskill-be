import { SetMetadata } from '@nestjs/common';

/** Metadata key for allowing PLATFORM_OWNER without tenant (kept for future use). */
export const ALLOW_PLATFORM_OWNER_WITHOUT_TENANT_KEY = 'allowPlatformOwnerWithoutTenant';

/**
 * When applied to a handler, PLATFORM_OWNER can access the route without sending x-org-id.
 * (RequireTenantGuard currently allows PLATFORM_OWNER through unconditionally.)
 */
export const AllowPlatformOwnerWithoutTenant = () =>
  SetMetadata(ALLOW_PLATFORM_OWNER_WITHOUT_TENANT_KEY, true);
