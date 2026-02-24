/**
 * Per-organization roles. Exactly one SUPER_ADMIN per organization.
 * PLATFORM_OWNER is global (no org scope for platform endpoints).
 */
export const ROLES = {
  PLATFORM_OWNER: 'PLATFORM_OWNER',
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ORG_ROLES: Role[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.USER,
];

export function isPlatformOwner(role: string): boolean {
  return role === ROLES.PLATFORM_OWNER;
}

export function isSuperAdmin(role: string): boolean {
  return role === ROLES.SUPER_ADMIN;
}

export function isOrgRole(role: string): boolean {
  return ORG_ROLES.includes(role as Role);
}
