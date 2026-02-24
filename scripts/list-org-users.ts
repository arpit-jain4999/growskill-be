/**
 * List users for an organisation (role, phone, email) to debug why SUPER_ADMIN shows as USER.
 *
 * Usage: npx ts-node -r tsconfig-paths/register scripts/list-org-users.ts <orgId>
 * Example: npx ts-node -r tsconfig-paths/register scripts/list-org-users.ts 698b0f6076ca77d98d706e65
 */

import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

import mongoose from 'mongoose';

async function main() {
  const orgId = process.argv[2];
  if (!orgId) {
    console.error('Usage: npx ts-node scripts/list-org-users.ts <orgId>');
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
  const users = await db
    .collection('users')
    .find({ organizationId: new mongoose.Types.ObjectId(orgId) })
    .sort({ createdAt: -1 })
    .toArray();

  console.log(`Org ${orgId} – ${users.length} user(s):\n`);
  users.forEach((u: { _id: unknown; name?: string; email?: string; countryCode?: string; phoneNumber?: string; role?: string; createdAt?: Date }) => {
    console.log(`  _id:        ${u._id}`);
    console.log(`  name:       ${u.name ?? '—'}`);
    console.log(`  email:      ${u.email ?? '—'}`);
    console.log(`  phone:      ${u.countryCode ?? ''} ${u.phoneNumber ?? '—'}`);
    console.log(`  role:       ${u.role ?? 'USER'}`);
    console.log(`  createdAt:  ${u.createdAt ?? '—'}`);
    console.log('');
  });

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
