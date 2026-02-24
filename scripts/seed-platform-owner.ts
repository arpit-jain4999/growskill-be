/**
 * Seed script: create PLATFORM_OWNER user and fixed OTP 040999.
 *
 * User: countryCode +91, phoneNumber 9910176391, role PLATFORM_OWNER.
 * OTP 040999 is accepted for this phone for lifetime (see OtpService.verifyOtp).
 *
 * Usage: npm run seed:platform-owner
 * Requires: .env with DB_USER_NAME, DB_PASSWORD, DB_CLUSTER_NAME, DB_NAME (optional, default skillgroww)
 */

import * as path from 'path';
import mongoose from 'mongoose';

// Load .env from project root (growskill-be). dotenv is a dependency of @nestjs/config.
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const COUNTRY_CODE = '91';
const PHONE_NUMBER = '9910176391';
const FIXED_OTP = '040999';
const OTP_EXPIRES_AT = new Date('2099-12-31T23:59:59.999Z');

async function seed() {
  const dbUserName = process.env.DB_USER_NAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbClusterName = process.env.DB_CLUSTER_NAME;
  const dbName = process.env.DB_NAME || 'skillgroww';

  if (!dbUserName || !dbPassword || !dbClusterName) {
    throw new Error(
      'Missing DB_USER_NAME, DB_PASSWORD, or DB_CLUSTER_NAME in .env'
    );
  }

  const uri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbClusterName}/${dbName}`;
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  if (!db) throw new Error('No DB connection');

  const users = db.collection('users');
  const otps = db.collection('otps');

  // Upsert PLATFORM_OWNER user (no org)
  const userFilter = {
    countryCode: COUNTRY_CODE,
    phoneNumber: PHONE_NUMBER,
    $or: [{ organizationId: null }, { organizationId: { $exists: false } }],
  };
  const userDoc = {
    countryCode: COUNTRY_CODE,
    phoneNumber: PHONE_NUMBER,
    role: 'PLATFORM_OWNER',
    permissions: [],
    isVerified: true,
    organizationId: null,
    updatedAt: new Date(),
  };
  const existing = await users.findOne(userFilter);
  if (existing) {
    await users.updateOne(userFilter, { $set: userDoc });
    console.log('Updated existing PLATFORM_OWNER user:', existing._id);
  } else {
    const inserted = await users.insertOne({
      ...userDoc,
      createdAt: new Date(),
    });
    console.log('Created PLATFORM_OWNER user:', inserted.insertedId);
  }

  // Replace OTP for this phone with fixed 040999 (long expiry)
  await otps.deleteMany({ countryCode: COUNTRY_CODE, phoneNumber: PHONE_NUMBER });
  await otps.insertOne({
    countryCode: COUNTRY_CODE,
    phoneNumber: PHONE_NUMBER,
    code: FIXED_OTP,
    expiresAt: OTP_EXPIRES_AT,
    isUsed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('Set OTP to', FIXED_OTP, 'for', `+${COUNTRY_CODE} ${PHONE_NUMBER} (expires 2099)`);

  await mongoose.disconnect();
  console.log('Seed done. Login with +91 / 9910176391 and OTP 040999.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
