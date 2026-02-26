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
exports.OrganizationRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("../schemas/organization.schema");
let OrganizationRepository = class OrganizationRepository {
    constructor(orgModel) {
        this.orgModel = orgModel;
    }
    async create(data) {
        const doc = await this.orgModel.create(data);
        return doc;
    }
    async findAll() {
        return this.orgModel.find().sort({ createdAt: -1 });
    }
    async findById(id) {
        return this.orgModel.findById(id);
    }
    async update(id, data) {
        return this.orgModel
            .findByIdAndUpdate(id, { $set: data }, { new: true })
            .exec();
    }
    async delete(id) {
        await this.orgModel.findByIdAndDelete(id).exec();
    }
};
exports.OrganizationRepository = OrganizationRepository;
exports.OrganizationRepository = OrganizationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrganizationRepository);
//# sourceMappingURL=organization.repository.js.map