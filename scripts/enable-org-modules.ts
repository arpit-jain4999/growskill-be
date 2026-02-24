/**
 * Enable default LMS modules (courses, cohorts, modules) for an existing organisation.
 * Use this if you onboarded an org before we auto-enabled modules; SUPER_ADMIN will then get permissions.
 *
 * Usage: npx ts-node -r tsconfig-paths/register scripts/enable-org-modules.ts <orgId>
 * Example: npx ts-node -r tsconfig-paths/register scripts/enable-org-modules.ts 698b0f6076ca77d98d706e65
 */

import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

import mongoose from 'mongoose';

const MODULE_KEYS = ['courses', 'cohorts', 'modules'] as const;

async function main() {
  const orgId = process.argv[2];
  if (!orgId) {
    console.error('Usage: npx ts-node scripts/enable-org-modules.ts <orgId>');
    process.exit(1);
  }

  const dbUserName = process.env.DB_USER_NAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbClusterName = process.env.DB_CLUSTER_NAME;
  const dbName = process.env.DB_NAME || 'skillgroww';

  if (!dbUserName || !dbPassword || !dbClusterName) {
    throw new Error('Missing DB_* env vars');
  }

  const uri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbClusterName}/${dbName}`;
  await mongoose.connect(uri);

  const db = mongoose.connection.db!;
  const usersCol = db.collection('users');
  const superAdmin = await usersCol.findOne({
    organizationId: new mongoose.Types.ObjectId(orgId),
    role: 'SUPER_ADMIN',
  });
  const enabledByUserId = superAdmin?._id ?? new mongoose.Types.ObjectId(orgId);

  const collection = db.collection('organizationmodules');
  for (const moduleKey of MODULE_KEYS) {
    const existing = await collection.findOne({
      organizationId: new mongoose.Types.ObjectId(orgId),
      moduleKey,
    });
    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: { enabled: true, enabledAt: new Date() } },
      );
      console.log(`Updated module ${moduleKey} -> enabled`);
    } else {
      await collection.insertOne({
        organizationId: new mongoose.Types.ObjectId(orgId),
        moduleKey,
        enabled: true,
        enabledAt: new Date(),
        enabledByUserId,
      });
      console.log(`Inserted module ${moduleKey} -> enabled`);
    }
  }

  console.log(`Done. Org ${orgId} now has modules: ${MODULE_KEYS.join(', ')}. SUPER_ADMIN can use courses, cohorts, modules.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
