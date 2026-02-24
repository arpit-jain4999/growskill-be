/**
 * Resolved request context: who is acting and in which tenant.
 * Set by JWT + optional x-org-id validation.
 */
export interface Actor {
  userId: string;
  organizationId: string | null;
  role: string;
  permissions: string[];
  countryCode?: string;
  phoneNumber?: string;
}

export function hasPermission(actor: Actor, permission: string): boolean {
  if (actor.role === 'PLATFORM_OWNER') return true;
  return actor.permissions.includes(permission);
}

export function isInOrg(actor: Actor): boolean {
  return actor.organizationId != null && actor.organizationId !== '';
}
