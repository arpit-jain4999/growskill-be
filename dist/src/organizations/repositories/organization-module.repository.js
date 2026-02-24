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
exports.OrganizationModuleRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_module_schema_1 = require("../schemas/organization-module.schema");
let OrganizationModuleRepository = class OrganizationModuleRepository {
    constructor(model) {
        this.model = model;
    }
    async findEnabledByOrg(organizationId) {
        return this.model
            .find({ organizationId: new mongoose_2.Types.ObjectId(organizationId), enabled: true })
            .exec();
    }
    async findAllByOrg(organizationId) {
        return this.model
            .find({ organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .exec();
    }
    async disable(organizationId, moduleKey) {
        const doc = await this.model.findOne({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            moduleKey,
        });
        if (!doc)
            return null;
        doc.enabled = false;
        return doc.save();
    }
    async enable(organizationId, moduleKey, enabledByUserId) {
        const existing = await this.model.findOne({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            moduleKey,
        });
        if (existing) {
            existing.enabled = true;
            existing.enabledAt = new Date();
            existing.enabledByUserId = new mongoose_2.Types.ObjectId(enabledByUserId);
            return existing.save();
        }
        return this.model.create({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            moduleKey,
            enabled: true,
            enabledAt: new Date(),
            enabledByUserId: new mongoose_2.Types.ObjectId(enabledByUserId),
        });
    }
    async isEnabled(organizationId, moduleKey) {
        const doc = await this.model.findOne({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            moduleKey,
            enabled: true,
        });
        return !!doc;
    }
};
exports.OrganizationModuleRepository = OrganizationModuleRepository;
exports.OrganizationModuleRepository = OrganizationModuleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_module_schema_1.OrganizationModule.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrganizationModuleRepository);
//# sourceMappingURL=organization-module.repository.js.map