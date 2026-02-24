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
exports.OrgPermissionRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const org_permission_schema_1 = require("../schemas/org-permission.schema");
let OrgPermissionRepository = class OrgPermissionRepository {
    constructor(model) {
        this.model = model;
    }
    async findByOrg(organizationId) {
        return this.model
            .find({ organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .sort({ permissionKey: 1 })
            .exec();
    }
    async findKeysByOrg(organizationId) {
        const docs = await this.findByOrg(organizationId);
        return docs.map((d) => d.permissionKey);
    }
    async hasKey(organizationId, permissionKey) {
        const doc = await this.model.findOne({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            permissionKey,
        });
        return !!doc;
    }
    async bulkInsert(organizationId, permissionKeys, grantedBy) {
        const orgOid = new mongoose_2.Types.ObjectId(organizationId);
        const grantedByOid = new mongoose_2.Types.ObjectId(grantedBy);
        const ops = permissionKeys.map((key) => ({
            updateOne: {
                filter: { organizationId: orgOid, permissionKey: key },
                update: {
                    $setOnInsert: {
                        organizationId: orgOid,
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
    async bulkRemove(organizationId, permissionKeys) {
        if (permissionKeys.length === 0)
            return 0;
        const result = await this.model.deleteMany({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            permissionKey: { $in: permissionKeys },
        });
        return result.deletedCount ?? 0;
    }
};
exports.OrgPermissionRepository = OrgPermissionRepository;
exports.OrgPermissionRepository = OrgPermissionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(org_permission_schema_1.OrgPermission.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrgPermissionRepository);
//# sourceMappingURL=org-permission.repository.js.map