import { SetMetadata } from '@nestjs/common';

export const AUTHORIZE_PERMISSION_KEY = 'authorize:permission';

/**
 * Require the given permission for this handler.
 * Use with AuthorizeGuard. Actor must have the permission (or be PLATFORM_OWNER).
 */
export const Authorize = (permission: string) =>
  SetMetadata(AUTHORIZE_PERMISSION_KEY, permission);
