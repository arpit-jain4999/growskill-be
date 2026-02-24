"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose_1 = require("mongoose");
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
    await mongoose_1.default.connect(uri);
    const db = mongoose_1.default.connection.db;
    const users = await db
        .collection('users')
        .find({ organizationId: new mongoose_1.default.Types.ObjectId(orgId) })
        .sort({ createdAt: -1 })
        .toArray();
    console.log(`Org ${orgId} – ${users.length} user(s):\n`);
    users.forEach((u) => {
        console.log(`  _id:        ${u._id}`);
        console.log(`  name:       ${u.name ?? '—'}`);
        console.log(`  email:      ${u.email ?? '—'}`);
        console.log(`  phone:      ${u.countryCode ?? ''} ${u.phoneNumber ?? '—'}`);
        console.log(`  role:       ${u.role ?? 'USER'}`);
        console.log(`  createdAt:  ${u.createdAt ?? '—'}`);
        console.log('');
    });
    await mongoose_1.default.disconnect();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=list-org-users.js.map