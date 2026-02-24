/**
 * One-time migration script: seeds OrgPermission and UserPermission collections
 * from existing OrganizationModule (enabled features) and User.permissions data.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/migrate-permissions.ts
 *
 * Or from the NestJS app context (recommended):
 *   Add a temporary CLI command or run via a bootstrap script.
 *
 * This script is idempotent — re-running it will not create duplicates
 * thanks to the unique indexes and upsert operations.
 */

import { connect, connection, model, Schema, Types } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MODULE_PERMISSIONS: Record<string, string[]> = {
  courses: ['course:create', 'course:read', 'course:update', 'course:delete'],
  cohorts: ['cohort:create', 'cohort:read', 'cohort:update', 'cohort:delete'],
  modules: ['module:create', 'module:read', 'module:update', 'module:delete'],
  chapters: ['chapter:create', 'chapter:read', 'chapter:update', 'chapter:delete'],
};

const OrgModuleSchema = new Schema({
  organizationId: Schema.Types.ObjectId,
  moduleKey: String,
  enabled: Boolean,
  enabledAt: Date,
  enabledByUserId: Schema.Types.ObjectId,
});

const OrgPermissionSchema = new Schema({
  organizationId: Schema.Types.ObjectId,
  permissionKey: String,
  grantedAt: Date,
  grantedBy: Schema.Types.ObjectId,
});
OrgPermissionSchema.index({ organizationId: 1, permissionKey: 1 }, { unique: true });

const UserPermissionSchema = new Schema({
  organizationId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  permissionKey: String,
  grantedAt: Date,
  grantedBy: Schema.Types.ObjectId,
});
UserPermissionSchema.index({ organizationId: 1, userId: 1, permissionKey: 1 }, { unique: true });

const UserSchema = new Schema({
  organizationId: Schema.Types.ObjectId,
  permissions: [String],
  role: String,
});

async function main() {
  const dbUser = process.env.DB_USER_NAME;
  const dbPass = process.env.DB_PASSWORD;
  const dbCluster = process.env.DB_CLUSTER_NAME;
  const dbName = process.env.DB_NAME || 'skillgroww';

  if (!dbUser || !dbPass || !dbCluster) {
    console.error('Missing DB_USER_NAME, DB_PASSWORD, or DB_CLUSTER_NAME in .env');
    process.exit(1);
  }

  const uri = `mongodb+srv://${dbUser}:${dbPass}@${dbCluster}/${dbName}`;
  console.log(`Connecting to ${dbName}…`);
  await connect(uri);
  console.log('Connected.\n');

  const OrgModule = model('OrganizationModule', OrgModuleSchema, 'organizationmodules');
  const OrgPermission = model('OrgPermission', OrgPermissionSchema, 'orgpermissions');
  const UserPermission = model('UserPermission', UserPermissionSchema, 'userpermissions');
  const User = model('User', UserSchema, 'users');

  // ─── Step 1: Seed OrgPermission from enabled OrganizationModules ───
  console.log('Step 1: Seeding OrgPermission from enabled OrganizationModules…');
  const enabledModules = await OrgModule.find({ enabled: true }).lean();
  let orgPermInserted = 0;

  for (const mod of enabledModules) {
    const perms = MODULE_PERMISSIONS[mod.moduleKey as string];
    if (!perms) continue;

    for (const key of perms) {
      try {
        await OrgPermission.updateOne(
          { organizationId: mod.organizationId, permissionKey: key },
          {
            $setOnInsert: {
              organizationId: mod.organizationId,
              permissionKey: key,
              grantedAt: mod.enabledAt ?? new Date(),
              grantedBy: mod.enabledByUserId ?? mod.organizationId,
            },
          },
          { upsert: true },
        );
        orgPermInserted++;
      } catch (err: any) {
        if (err.code !== 11000) throw err;
      }
    }
  }
  console.log(`  → Processed ${orgPermInserted} org permission upserts from ${enabledModules.length} enabled modules.\n`);

  // ─── Step 2: Seed UserPermission from User.permissions ──────────
  console.log('Step 2: Seeding UserPermission from User.permissions…');
  const usersWithPerms = await User.find({
    permissions: { $exists: true, $ne: [] },
    organizationId: { $exists: true, $ne: null },
  }).lean();

  let userPermInserted = 0;

  for (const user of usersWithPerms) {
    const perms = (user.permissions ?? []) as string[];
    if (perms.length === 0) continue;

    for (const key of perms) {
      try {
        await UserPermission.updateOne(
          {
            organizationId: user.organizationId,
            userId: user._id,
            permissionKey: key,
          },
          {
            $setOnInsert: {
              organizationId: user.organizationId,
              userId: user._id,
              permissionKey: key,
              grantedAt: new Date(),
              grantedBy: user._id,
            },
          },
          { upsert: true },
        );
        userPermInserted++;
      } catch (err: any) {
        if (err.code !== 11000) throw err;
      }
    }
  }
  console.log(`  → Processed ${userPermInserted} user permission upserts from ${usersWithPerms.length} users.\n`);

  // ─── Summary ────────────────────────────────────────────────────
  const orgPermCount = await OrgPermission.countDocuments();
  const userPermCount = await UserPermission.countDocuments();
  console.log('Migration complete.');
  console.log(`  OrgPermission documents: ${orgPermCount}`);
  console.log(`  UserPermission documents: ${userPermCount}`);
  console.log('\nYou can now safely remove the User.permissions field from documents:');
  console.log('  db.users.updateMany({}, { $unset: { permissions: "" } })');

  await connection.close();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
