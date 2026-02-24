import { ForbiddenException } from '@nestjs/common';

/**
 * Enforce tenant isolation: resource must belong to the actor's organization.
 * Call after loading a resource and before returning or mutating.
 */
export function assertSameOrg(
  resourceOrgId: string | null | undefined,
  actorOrgId: string | null | undefined,
): void {
  if (actorOrgId == null || actorOrgId === '') {
    throw new ForbiddenException('Tenant context required');
  }
  const resource = resourceOrgId?.toString?.() ?? resourceOrgId;
  const actor = actorOrgId?.toString?.() ?? actorOrgId;
  if (resource !== actor) {
    throw new ForbiddenException('Access denied: resource belongs to another organization');
  }
}
