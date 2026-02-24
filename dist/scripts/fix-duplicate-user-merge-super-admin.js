"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose_1 = require("mongoose");
function normalizeCountryCode(code) {
    return (code || '').replace(/^\+/, '').trim() || (code || '');
}
function normalizePhoneNumber(phone) {
    return (phone || '').trim().replace(/\s+/g, ' ');
}
async function main() {
    const dbUserName = process.env.DB_USER_NAME;
    const dbPassword = process.env.DB_PASSWORD;
    const dbClusterName = process.env.DB_CLUSTER_NAME;
    const dbName = process.env.DB_NAME || 'skillgroww';
    if (!dbUserName || !dbPassword || !dbClusterName) {
        throw new Error('Missing DB_* env vars');
    }
    const uri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbClusterName}/${dbName}`;
    await mongoose_1.default.connect(uri);
    const db = mongoose_1.default.connection.db;
    const usersCol = db.collection('users');
    const users = (await usersCol.find({}).toArray());
    const byKey = new Map();
    for (const u of users) {
        const orgId = u.organizationId?.toString() ?? 'null';
        const normCountry = normalizeCountryCode(u.countryCode ?? '');
        const normPhone = normalizePhoneNumber(u.phoneNumber ?? '');
        const key = `${orgId}:${normCountry}:${normPhone}`;
        if (!byKey.has(key))
            byKey.set(key, []);
        byKey.get(key).push(u);
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
            if (u.role === 'USER')
                continue;
            const normCountry = normalizeCountryCode(u.countryCode ?? '');
            const normPhone = normalizePhoneNumber(u.phoneNumber ?? '');
            const needsUpdate = (u.countryCode ?? '') !== normCountry || (u.phoneNumber ?? '') !== normPhone;
            if (needsUpdate) {
                await usersCol.updateOne({ _id: u._id }, { $set: { countryCode: normCountry, phoneNumber: normPhone } });
                updated++;
                console.log(`Updated ${u.role} ${u._id} to normalized phone (${normCountry} ${normPhone})`);
            }
        }
    }
    console.log(`Done. Deleted ${deleted} USER(s), updated ${updated} user(s) to normalized phone.`);
    await mongoose_1.default.disconnect();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=fix-duplicate-user-merge-super-admin.js.map