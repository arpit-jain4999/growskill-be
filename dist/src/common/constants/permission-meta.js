"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_META = void 0;
const permissions_1 = require("./permissions");
exports.PERMISSION_META = [
    { key: permissions_1.PERMISSIONS.ORG_READ, group: 'Organization', label: 'View organisation details' },
    { key: permissions_1.PERMISSIONS.ORG_UPDATE, group: 'Organization', label: 'Update organisation details' },
    { key: permissions_1.PERMISSIONS.USER_CREATE, group: 'Users', label: 'Create users' },
    { key: permissions_1.PERMISSIONS.USER_READ, group: 'Users', label: 'View users' },
    { key: permissions_1.PERMISSIONS.USER_UPDATE, group: 'Users', label: 'Update users' },
    { key: permissions_1.PERMISSIONS.USER_DELETE, group: 'Users', label: 'Delete users' },
    { key: permissions_1.PERMISSIONS.USER_ASSIGN_ROLE_ADMIN, group: 'Users', label: 'Assign ADMIN role (SUPER_ADMIN only)' },
    { key: permissions_1.PERMISSIONS.PERMISSION_GRANT, group: 'Permissions', label: 'Grant / revoke permissions' },
    { key: permissions_1.PERMISSIONS.COURSE_CREATE, group: 'Courses', label: 'Create courses' },
    { key: permissions_1.PERMISSIONS.COURSE_READ, group: 'Courses', label: 'View courses' },
    { key: permissions_1.PERMISSIONS.COURSE_UPDATE, group: 'Courses', label: 'Update courses' },
    { key: permissions_1.PERMISSIONS.COURSE_DELETE, group: 'Courses', label: 'Delete courses' },
    { key: permissions_1.PERMISSIONS.MODULE_CREATE, group: 'Modules', label: 'Create modules' },
    { key: permissions_1.PERMISSIONS.MODULE_READ, group: 'Modules', label: 'View modules' },
    { key: permissions_1.PERMISSIONS.MODULE_UPDATE, group: 'Modules', label: 'Update modules' },
    { key: permissions_1.PERMISSIONS.MODULE_DELETE, group: 'Modules', label: 'Delete modules' },
    { key: permissions_1.PERMISSIONS.CHAPTER_CREATE, group: 'Chapters', label: 'Create chapters' },
    { key: permissions_1.PERMISSIONS.CHAPTER_READ, group: 'Chapters', label: 'View chapters' },
    { key: permissions_1.PERMISSIONS.CHAPTER_UPDATE, group: 'Chapters', label: 'Update chapters' },
    { key: permissions_1.PERMISSIONS.CHAPTER_DELETE, group: 'Chapters', label: 'Delete chapters' },
    { key: permissions_1.PERMISSIONS.COHORT_CREATE, group: 'Cohorts', label: 'Create cohorts' },
    { key: permissions_1.PERMISSIONS.COHORT_READ, group: 'Cohorts', label: 'View cohorts' },
    { key: permissions_1.PERMISSIONS.COHORT_UPDATE, group: 'Cohorts', label: 'Update cohorts' },
    { key: permissions_1.PERMISSIONS.COHORT_DELETE, group: 'Cohorts', label: 'Delete cohorts' },
];
//# sourceMappingURL=permission-meta.js.map