import { PERMISSIONS } from './permissions';

export interface PermissionMeta {
  key: string;
  group: string;
  label: string;
}

export const PERMISSION_META: PermissionMeta[] = [
  { key: PERMISSIONS.ORG_READ, group: 'Organization', label: 'View organisation details' },
  { key: PERMISSIONS.ORG_UPDATE, group: 'Organization', label: 'Update organisation details' },

  { key: PERMISSIONS.USER_CREATE, group: 'Users', label: 'Create users' },
  { key: PERMISSIONS.USER_READ, group: 'Users', label: 'View users' },
  { key: PERMISSIONS.USER_UPDATE, group: 'Users', label: 'Update users' },
  { key: PERMISSIONS.USER_DELETE, group: 'Users', label: 'Delete users' },
  { key: PERMISSIONS.USER_ASSIGN_ROLE_ADMIN, group: 'Users', label: 'Assign ADMIN role (SUPER_ADMIN only)' },

  { key: PERMISSIONS.PERMISSION_GRANT, group: 'Permissions', label: 'Grant / revoke permissions' },

  { key: PERMISSIONS.COURSE_CREATE, group: 'Courses', label: 'Create courses' },
  { key: PERMISSIONS.COURSE_READ, group: 'Courses', label: 'View courses' },
  { key: PERMISSIONS.COURSE_UPDATE, group: 'Courses', label: 'Update courses' },
  { key: PERMISSIONS.COURSE_DELETE, group: 'Courses', label: 'Delete courses' },

  { key: PERMISSIONS.MODULE_CREATE, group: 'Modules', label: 'Create modules' },
  { key: PERMISSIONS.MODULE_READ, group: 'Modules', label: 'View modules' },
  { key: PERMISSIONS.MODULE_UPDATE, group: 'Modules', label: 'Update modules' },
  { key: PERMISSIONS.MODULE_DELETE, group: 'Modules', label: 'Delete modules' },

  { key: PERMISSIONS.CHAPTER_CREATE, group: 'Chapters', label: 'Create chapters' },
  { key: PERMISSIONS.CHAPTER_READ, group: 'Chapters', label: 'View chapters' },
  { key: PERMISSIONS.CHAPTER_UPDATE, group: 'Chapters', label: 'Update chapters' },
  { key: PERMISSIONS.CHAPTER_DELETE, group: 'Chapters', label: 'Delete chapters' },

  { key: PERMISSIONS.COHORT_CREATE, group: 'Cohorts', label: 'Create cohorts' },
  { key: PERMISSIONS.COHORT_READ, group: 'Cohorts', label: 'View cohorts' },
  { key: PERMISSIONS.COHORT_UPDATE, group: 'Cohorts', label: 'Update cohorts' },
  { key: PERMISSIONS.COHORT_DELETE, group: 'Cohorts', label: 'Delete cohorts' },
];
