"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_READ_PERMISSION = exports.MODULE_PERMISSIONS = exports.MODULE_KEYS = exports.ALL_PERMISSIONS = exports.PERMISSIONS = void 0;
exports.PERMISSIONS = {
    ORG_READ: 'org:read',
    ORG_UPDATE: 'org:update',
    USER_CREATE: 'user:create',
    USER_READ: 'user:read',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
    USER_ASSIGN_ROLE_ADMIN: 'user:assign_role_admin',
    PERMISSION_GRANT: 'permission:grant',
    MODULE_CREATE: 'module:create',
    MODULE_READ: 'module:read',
    MODULE_UPDATE: 'module:update',
    MODULE_DELETE: 'module:delete',
    CHAPTER_CREATE: 'chapter:create',
    CHAPTER_READ: 'chapter:read',
    CHAPTER_UPDATE: 'chapter:update',
    CHAPTER_DELETE: 'chapter:delete',
    COURSE_CREATE: 'course:create',
    COURSE_READ: 'course:read',
    COURSE_UPDATE: 'course:update',
    COURSE_DELETE: 'course:delete',
    COHORT_CREATE: 'cohort:create',
    COHORT_READ: 'cohort:read',
    COHORT_UPDATE: 'cohort:update',
    COHORT_DELETE: 'cohort:delete',
};
exports.ALL_PERMISSIONS = Object.values(exports.PERMISSIONS);
exports.MODULE_KEYS = {
    COURSES: 'courses',
    COHORTS: 'cohorts',
    MODULES: 'modules',
    CHAPTERS: 'chapters',
    ASSESSMENTS: 'assessments',
};
exports.MODULE_PERMISSIONS = {
    [exports.MODULE_KEYS.COURSES]: [
        exports.PERMISSIONS.COURSE_CREATE,
        exports.PERMISSIONS.COURSE_READ,
        exports.PERMISSIONS.COURSE_UPDATE,
        exports.PERMISSIONS.COURSE_DELETE,
    ],
    [exports.MODULE_KEYS.COHORTS]: [
        exports.PERMISSIONS.COHORT_CREATE,
        exports.PERMISSIONS.COHORT_READ,
        exports.PERMISSIONS.COHORT_UPDATE,
        exports.PERMISSIONS.COHORT_DELETE,
    ],
    [exports.MODULE_KEYS.MODULES]: [
        exports.PERMISSIONS.MODULE_CREATE,
        exports.PERMISSIONS.MODULE_READ,
        exports.PERMISSIONS.MODULE_UPDATE,
        exports.PERMISSIONS.MODULE_DELETE,
    ],
    [exports.MODULE_KEYS.CHAPTERS]: [
        exports.PERMISSIONS.CHAPTER_CREATE,
        exports.PERMISSIONS.CHAPTER_READ,
        exports.PERMISSIONS.CHAPTER_UPDATE,
        exports.PERMISSIONS.CHAPTER_DELETE,
    ],
};
exports.MODULE_READ_PERMISSION = {
    [exports.MODULE_KEYS.COURSES]: exports.PERMISSIONS.COURSE_READ,
    [exports.MODULE_KEYS.COHORTS]: exports.PERMISSIONS.COHORT_READ,
    [exports.MODULE_KEYS.MODULES]: exports.PERMISSIONS.MODULE_READ,
    [exports.MODULE_KEYS.CHAPTERS]: exports.PERMISSIONS.CHAPTER_READ,
};
//# sourceMappingURL=permissions.js.map