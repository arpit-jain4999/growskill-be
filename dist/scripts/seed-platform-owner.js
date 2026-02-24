"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const mongoose_1 = require("mongoose");
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
        throw new Error('Missing DB_USER_NAME, DB_PASSWORD, or DB_CLUSTER_NAME in .env');
    }
    const uri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbClusterName}/${dbName}`;
    await mongoose_1.default.connect(uri);
    const db = mongoose_1.default.connection.db;
    if (!db)
        throw new Error('No DB connection');
    const users = db.collection('users');
    const otps = db.collection('otps');
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
    }
    else {
        const inserted = await users.insertOne({
            ...userDoc,
            createdAt: new Date(),
        });
        console.log('Created PLATFORM_OWNER user:', inserted.insertedId);
    }
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
    await mongoose_1.default.disconnect();
    console.log('Seed done. Login with +91 / 9910176391 and OTP 040999.');
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed-platform-owner.js.map