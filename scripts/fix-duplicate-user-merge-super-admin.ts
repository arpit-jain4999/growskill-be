/**
 * Delete USER duplicate(s) and update SUPER_ADMIN to normalized phone.
 * For each (org, same normalized phone): delete users with role USER, update SUPER_ADMIN (or remaining user) to normalized countryCode and phoneNumber.
 *
 * Usage: npx ts-node -r tsconfig-paths/register scripts/fix-duplicate-user-merge-super-admin.ts
 */

import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

import mongoose from 'mongoose';

function normalizeCountryCode(code: string): string {
  return (code || '').replace(/^\+/, '').trim() || (code || '');
}
function normalizePhoneNumber(phone: string): string {
  return (phone || '').trim().replace(/\s+/g, ' ');
}

type UserDoc = {
  _id: unknown;
  organizationId?: unknown;
  countryCode?: string;
  phoneNumber?: string;
  role?: string;
};

async function main() {
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

  const users = (await usersCol.find({}).toArray()) as UserDoc[];

  // Group by (orgId, normalized country, normalized phone)
  const byKey = new Map<string, UserDoc[]>();
  for (const u of users) {
    const orgId = u.organizationId?.toString() ?? 'null';
    const normCountry = normalizeCountryCode(u.countryCode ?? '');
    const normPhone = normalizePhoneNumber(u.phoneNumber ?? '');
    const key = `${orgId}:${normCountry}:${normPhone}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(u);
  }

  let deleted = 0;
  let updated = 0;

  for (const [key, group] of byKey) {
    const usersToDelete = group.filter((u) => u.role === 'USER');

    for (const u of usersToDelete) {
      await usersCol.deleteOne({ _id: u._id });
      deleted++;
      console.log(`Deleted USER ${u._id} (org+phone key: ${key})`);
    }

    for (const u of group) {
      if (u.role === 'USER') continue;
      const normCountry = normalizeCountryCode(u.countryCode ?? '');
      const normPhone = normalizePhoneNumber(u.phoneNumber ?? '');
      const needsUpdate =
        (u.countryCode ?? '') !== normCountry || (u.phoneNumber ?? '') !== normPhone;
      if (needsUpdate) {
        await usersCol.updateOne(
          { _id: u._id },
          { $set: { countryCode: normCountry, phoneNumber: normPhone } },
        );
        updated++;
        console.log(`Updated ${u.role} ${u._id} to normalized phone (${normCountry} ${normPhone})`);
      }
    }
  }

  console.log(`Done. Deleted ${deleted} USER(s), updated ${updated} user(s) to normalized phone.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
