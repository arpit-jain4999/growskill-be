"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_permission_schema_1 = require("../schemas/user-permission.schema");
let UserPermissionRepository = class UserPermissionRepository {
    constructor(model) {
        this.model = model;
    }
    async findByUser(organizationId, userId) {
        return this.model
            .find({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .sort({ permissionKey: 1 })
            .exec();
    }
    async findKeysByUser(organizationId, userId) {
        const docs = await this.findByUser(organizationId, userId);
        return docs.map((d) => d.permissionKey);
    }
    async grant(organizationId, userId, permissionKeys, grantedBy) {
        const orgOid = new mongoose_2.Types.ObjectId(organizationId);
        const userOid = new mongoose_2.Types.ObjectId(userId);
        const grantedByOid = new mongoose_2.Types.ObjectId(grantedBy);
        const ops = permissionKeys.map((key) => ({
            updateOne: {
                filter: { organizationId: orgOid, userId: userOid, permissionKey: key },
                update: {
                    $setOnInsert: {
                        organizationId: orgOid,
                        userId: userOid,
                        permissionKey: key,
                        grantedAt: new Date(),
                        grantedBy: grantedByOid,
                    },
                },
                upsert: true,
            },
        }));
        if (ops.length === 0)
            return 0;
        const result = await this.model.bulkWrite(ops);
        return result.upsertedCount ?? 0;
    }
    async revoke(organizationId, userId, permissionKeys) {
        if (permissionKeys.length === 0)
            return 0;
        const result = await this.model.deleteMany({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            userId: new mongoose_2.Types.ObjectId(userId),
            permissionKey: { $in: permissionKeys },
        });
        return result.deletedCount ?? 0;
    }
    async replaceAll(organizationId, userId, permissionKeys, grantedBy) {
        const orgOid = new mongoose_2.Types.ObjectId(organizationId);
        const userOid = new mongoose_2.Types.ObjectId(userId);
        await this.model.deleteMany({
            organizationId: orgOid,
            userId: userOid,
        });
        if (permissionKeys.length === 0)
            return;
        const grantedByOid = new mongoose_2.Types.ObjectId(grantedBy);
        const docs = permissionKeys.map((key) => ({
            organizationId: orgOid,
            userId: userOid,
            permissionKey: key,
            grantedAt: new Date(),
            grantedBy: grantedByOid,
        }));
        await this.model.insertMany(docs);
    }
};
exports.UserPermissionRepository = UserPermissionRepository;
exports.UserPermissionRepository = UserPermissionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_permission_schema_1.UserPermission.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserPermissionRepository);
//# sourceMappingURL=user-permission.repository.js.map