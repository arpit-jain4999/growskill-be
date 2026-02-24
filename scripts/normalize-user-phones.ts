/**
 * One-time migration: normalize all users' countryCode and phoneNumber, then merge duplicates.
 * Keeps SUPER_ADMIN over USER when same org+phone (e.g. "91" and "+91" both become "91", one user kept).
 *
 * Usage: npx ts-node -r tsconfig-paths/register scripts/normalize-user-phones.ts
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

const ROLE_PRIORITY: Record<string, number> = {
  PLATFORM_OWNER: 4,
  SUPER_ADMIN: 3,
  ADMIN: 2,
  USER: 1,
};

type UserRow = {
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

  const users = (await usersCol.find({}).toArray()) as UserRow[];
  console.log(`Found ${users.length} user(s). Grouping by (org, normalized phone)...`);

  // Group by (orgId, normalized country, normalized phone) — no DB writes yet
  const byKey = new Map<string, UserRow[]>();
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

  for (const [, group] of byKey) {
    if (group.length > 1) {
      group.sort((a, b) => (ROLE_PRIORITY[b.role ?? 'USER'] ?? 0) - (ROLE_PRIORITY[a.role ?? 'USER'] ?? 0));
    }
    const keep = group[0];
    const normCountry = normalizeCountryCode(keep.countryCode ?? '');
    const normPhoneVal = normalizePhoneNumber(keep.phoneNumber ?? '');

    if (group.length > 1) {
      for (let i = 1; i < group.length; i++) {
        await usersCol.deleteOne({ _id: group[i]._id });
        deleted++;
        console.log(`  Deleted duplicate user ${group[i]._id} (kept ${keep._id} with role ${keep.role})`);
      }
    }

    const needsUpdate =
      (keep.countryCode ?? '') !== normCountry || (keep.phoneNumber ?? '') !== normPhoneVal;
    if (needsUpdate) {
      await usersCol.updateOne(
        { _id: keep._id },
        { $set: { countryCode: normCountry, phoneNumber: normPhoneVal } },
      );
      updated++;
      console.log(`  Normalized ${keep.role} ${keep._id} -> ${normCountry} ${normPhoneVal}`);
    }
  }

  console.log(`Done. Deleted ${deleted} duplicate(s), normalized ${updated} user(s).`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
