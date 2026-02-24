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
const ROLE_PRIORITY = {
    PLATFORM_OWNER: 4,
    SUPER_ADMIN: 3,
    ADMIN: 2,
    USER: 1,
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
    await mongoose_1.default.connect(uri);
    const db = mongoose_1.default.connection.db;
    const usersCol = db.collection('users');
    const users = (await usersCol.find({}).toArray());
    console.log(`Found ${users.length} user(s). Grouping by (org, normalized phone)...`);
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
        const needsUpdate = (keep.countryCode ?? '') !== normCountry || (keep.phoneNumber ?? '') !== normPhoneVal;
        if (needsUpdate) {
            await usersCol.updateOne({ _id: keep._id }, { $set: { countryCode: normCountry, phoneNumber: normPhoneVal } });
            updated++;
            console.log(`  Normalized ${keep.role} ${keep._id} -> ${normCountry} ${normPhoneVal}`);
        }
    }
    console.log(`Done. Deleted ${deleted} duplicate(s), normalized ${updated} user(s).`);
    await mongoose_1.default.disconnect();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=normalize-user-phones.js.map