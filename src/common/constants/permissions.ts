/**
 * Fine-grained permission keys. A user can perform an action only if they have
 * the required permission (or are PLATFORM_OWNER / SUPER_ADMIN with module access).
 */
export const PERMISSIONS = {
  // Organization
  ORG_READ: 'org:read',
  ORG_UPDATE: 'org:update',

  // Users
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_ASSIGN_ROLE_ADMIN: 'user:assign_role_admin', // only SUPER_ADMIN

  // Grant permissions to others
  PERMISSION_GRANT: 'permission:grant',

  // Module (structural grouping within a course)
  MODULE_CREATE: 'module:create',
  MODULE_READ: 'module:read',
  MODULE_UPDATE: 'module:update',
  MODULE_DELETE: 'module:delete',

  // Chapter (content leaf: video/pdf/text within a module)
  CHAPTER_CREATE: 'chapter:create',
  CHAPTER_READ: 'chapter:read',
  CHAPTER_UPDATE: 'chapter:update',
  CHAPTER_DELETE: 'chapter:delete',

  // Course
  COURSE_CREATE: 'course:create',
  COURSE_READ: 'course:read',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',

  // Cohort
  COHORT_CREATE: 'cohort:create',
  COHORT_READ: 'cohort:read',
  COHORT_UPDATE: 'cohort:update',
  COHORT_DELETE: 'cohort:delete',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** All permission keys as array */
export const ALL_PERMISSIONS: string[] = Object.values(PERMISSIONS);

/** Module keys used in OrganizationModule (enabled features) */
export const MODULE_KEYS = {
  COURSES: 'courses',
  COHORTS: 'cohorts',
  MODULES: 'modules',
  CHAPTERS: 'chapters',
  ASSESSMENTS: 'assessments',
} as const;

/** Permissions per module (for bootstrap when module is enabled) */
export const MODULE_PERMISSIONS: Record<string, string[]> = {
  [MODULE_KEYS.COURSES]: [
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_READ,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_DELETE,
  ],
  [MODULE_KEYS.COHORTS]: [
    PERMISSIONS.COHORT_CREATE,
    PERMISSIONS.COHORT_READ,
    PERMISSIONS.COHORT_UPDATE,
    PERMISSIONS.COHORT_DELETE,
  ],
  [MODULE_KEYS.MODULES]: [
    PERMISSIONS.MODULE_CREATE,
    PERMISSIONS.MODULE_READ,
    PERMISSIONS.MODULE_UPDATE,
    PERMISSIONS.MODULE_DELETE,
  ],
  [MODULE_KEYS.CHAPTERS]: [
    PERMISSIONS.CHAPTER_CREATE,
    PERMISSIONS.CHAPTER_READ,
    PERMISSIONS.CHAPTER_UPDATE,
    PERMISSIONS.CHAPTER_DELETE,
  ],
};

/** Read-only permission per module. USER and ADMIN get these for every enabled module in their org. */
export const MODULE_READ_PERMISSION: Record<string, string> = {
  [MODULE_KEYS.COURSES]: PERMISSIONS.COURSE_READ,
  [MODULE_KEYS.COHORTS]: PERMISSIONS.COHORT_READ,
  [MODULE_KEYS.MODULES]: PERMISSIONS.MODULE_READ,
  [MODULE_KEYS.CHAPTERS]: PERMISSIONS.CHAPTER_READ,
};
