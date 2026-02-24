"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose_1 = require("mongoose");
const MODULE_KEYS = ['courses', 'cohorts', 'modules'];
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
    await mongoose_1.default.connect(uri);
    const db = mongoose_1.default.connection.db;
    const usersCol = db.collection('users');
    const superAdmin = await usersCol.findOne({
        organizationId: new mongoose_1.default.Types.ObjectId(orgId),
        role: 'SUPER_ADMIN',
    });
    const enabledByUserId = superAdmin?._id ?? new mongoose_1.default.Types.ObjectId(orgId);
    const collection = db.collection('organizationmodules');
    for (const moduleKey of MODULE_KEYS) {
        const existing = await collection.findOne({
            organizationId: new mongoose_1.default.Types.ObjectId(orgId),
            moduleKey,
        });
        if (existing) {
            await collection.updateOne({ _id: existing._id }, { $set: { enabled: true, enabledAt: new Date() } });
            console.log(`Updated module ${moduleKey} -> enabled`);
        }
        else {
            await collection.insertOne({
                organizationId: new mongoose_1.default.Types.ObjectId(orgId),
                moduleKey,
                enabled: true,
                enabledAt: new Date(),
                enabledByUserId,
            });
            console.log(`Inserted module ${moduleKey} -> enabled`);
        }
    }
    console.log(`Done. Org ${orgId} now has modules: ${MODULE_KEYS.join(', ')}. SUPER_ADMIN can use courses, cohorts, modules.`);
    await mongoose_1.default.disconnect();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=enable-org-modules.js.map