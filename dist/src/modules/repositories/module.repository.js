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
exports.ModuleRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const module_schema_1 = require("../schemas/module.schema");
let ModuleRepository = class ModuleRepository {
    constructor(moduleModel) {
        this.moduleModel = moduleModel;
    }
    async findAll() {
        return this.moduleModel.find({ isActive: true }).sort({ order: 1 });
    }
    async findAllForAdmin(organizationId) {
        return this.moduleModel
            .find({ organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .sort({ order: 1, createdAt: -1 });
    }
    async findById(id, organizationId) {
        const q = { _id: id };
        if (organizationId) {
            q.organizationId = new mongoose_2.Types.ObjectId(organizationId);
        }
        return this.moduleModel.findOne(q);
    }
    async findByCourseId(courseId) {
        return this.moduleModel.find({
            courseId: new mongoose_2.Types.ObjectId(courseId),
            isActive: true
        }).sort({ order: 1 });
    }
    async create(data) {
        return this.moduleModel.create(data);
    }
    async update(id, organizationId, data) {
        return this.moduleModel
            .findOneAndUpdate({ _id: id, organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: data }, { new: true })
            .exec();
    }
    async delete(id, organizationId) {
        return this.moduleModel
            .findOneAndDelete({ _id: id, organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .exec();
    }
};
exports.ModuleRepository = ModuleRepository;
exports.ModuleRepository = ModuleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ModuleRepository);
//# sourceMappingURL=module.repository.js.map