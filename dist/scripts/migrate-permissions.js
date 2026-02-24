"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MODULE_PERMISSIONS = {
    courses: ['course:create', 'course:read', 'course:update', 'course:delete'],
    cohorts: ['cohort:create', 'cohort:read', 'cohort:update', 'cohort:delete'],
    modules: ['module:create', 'module:read', 'module:update', 'module:delete'],
    chapters: ['chapter:create', 'chapter:read', 'chapter:update', 'chapter:delete'],
};
const OrgModuleSchema = new mongoose_1.Schema({
    organizationId: mongoose_1.Schema.Types.ObjectId,
    moduleKey: String,
    enabled: Boolean,
    enabledAt: Date,
    enabledByUserId: mongoose_1.Schema.Types.ObjectId,
});
const OrgPermissionSchema = new mongoose_1.Schema({
    organizationId: mongoose_1.Schema.Types.ObjectId,
    permissionKey: String,
    grantedAt: Date,
    grantedBy: mongoose_1.Schema.Types.ObjectId,
});
OrgPermissionSchema.index({ organizationId: 1, permissionKey: 1 }, { unique: true });
const UserPermissionSchema = new mongoose_1.Schema({
    organizationId: mongoose_1.Schema.Types.ObjectId,
    userId: mongoose_1.Schema.Types.ObjectId,
    permissionKey: String,
    grantedAt: Date,
    grantedBy: mongoose_1.Schema.Types.ObjectId,
});
UserPermissionSchema.index({ organizationId: 1, userId: 1, permissionKey: 1 }, { unique: true });
const UserSchema = new mongoose_1.Schema({
    organizationId: mongoose_1.Schema.Types.ObjectId,
    permissions: [String],
    role: String,
});
async function main() {
    const dbUser = process.env.DB_USER_NAME;
    const dbPass = process.env.DB_PASSWORD;
    const dbCluster = process.env.DB_CLUSTER_NAME;
    const dbName = process.env.DB_NAME || 'skillgroww';
    if (!dbUser || !dbPass || !dbCluster) {
        console.error('Missing DB_USER_NAME, DB_PASSWORD, or DB_CLUSTER_NAME in .env');
        process.exit(1);
    }
    const uri = `mongodb+srv://${dbUser}:${dbPass}@${dbCluster}/${dbName}`;
    console.log(`Connecting to ${dbName}…`);
    await (0, mongoose_1.connect)(uri);
    console.log('Connected.\n');
    const OrgModule = (0, mongoose_1.model)('OrganizationModule', OrgModuleSchema, 'organizationmodules');
    const OrgPermission = (0, mongoose_1.model)('OrgPermission', OrgPermissionSchema, 'orgpermissions');
    const UserPermission = (0, mongoose_1.model)('UserPermission', UserPermissionSchema, 'userpermissions');
    const User = (0, mongoose_1.model)('User', UserSchema, 'users');
    console.log('Step 1: Seeding OrgPermission from enabled OrganizationModules…');
    const enabledModules = await OrgModule.find({ enabled: true }).lean();
    let orgPermInserted = 0;
    for (const mod of enabledModules) {
        const perms = MODULE_PERMISSIONS[mod.moduleKey];
        if (!perms)
            continue;
        for (const key of perms) {
            try {
                await OrgPermission.updateOne({ organizationId: mod.organizationId, permissionKey: key }, {
                    $setOnInsert: {
                        organizationId: mod.organizationId,
                        permissionKey: key,
                        grantedAt: mod.enabledAt ?? new Date(),
                        grantedBy: mod.enabledByUserId ?? mod.organizationId,
                    },
                }, { upsert: true });
                orgPermInserted++;
            }
            catch (err) {
                if (err.code !== 11000)
                    throw err;
            }
        }
    }
    console.log(`  → Processed ${orgPermInserted} org permission upserts from ${enabledModules.length} enabled modules.\n`);
    console.log('Step 2: Seeding UserPermission from User.permissions…');
    const usersWithPerms = await User.find({
        permissions: { $exists: true, $ne: [] },
        organizationId: { $exists: true, $ne: null },
    }).lean();
    let userPermInserted = 0;
    for (const user of usersWithPerms) {
        const perms = (user.permissions ?? []);
        if (perms.length === 0)
            continue;
        for (const key of perms) {
            try {
                await UserPermission.updateOne({
                    organizationId: user.organizationId,
                    userId: user._id,
                    permissionKey: key,
                }, {
                    $setOnInsert: {
                        organizationId: user.organizationId,
                        userId: user._id,
                        permissionKey: key,
                        grantedAt: new Date(),
                        grantedBy: user._id,
                    },
                }, { upsert: true });
                userPermInserted++;
            }
            catch (err) {
                if (err.code !== 11000)
                    throw err;
            }
        }
    }
    console.log(`  → Processed ${userPermInserted} user permission upserts from ${usersWithPerms.length} users.\n`);
    const orgPermCount = await OrgPermission.countDocuments();
    const userPermCount = await UserPermission.countDocuments();
    console.log('Migration complete.');
    console.log(`  OrgPermission documents: ${orgPermCount}`);
    console.log(`  UserPermission documents: ${userPermCount}`);
    console.log('\nYou can now safely remove the User.permissions field from documents:');
    console.log('  db.users.updateMany({}, { $unset: { permissions: "" } })');
    await mongoose_1.connection.close();
}
main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
//# sourceMappingURL=migrate-permissions.js.map