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
exports.CohortRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cohort_schema_1 = require("../schemas/cohort.schema");
let CohortRepository = class CohortRepository {
    constructor(cohortModel) {
        this.cohortModel = cohortModel;
    }
    async findAll(organizationId) {
        return this.cohortModel
            .find({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            isActive: true,
        })
            .sort({ displayOrder: 1, createdAt: -1 });
    }
    async findAllForAdmin(organizationId) {
        return this.cohortModel
            .find({ organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .sort({ displayOrder: 1, createdAt: -1 });
    }
    async findById(id, organizationId) {
        const query = { _id: id };
        if (organizationId) {
            query.organizationId = new mongoose_2.Types.ObjectId(organizationId);
        }
        return this.cohortModel.findOne(query);
    }
    async create(cohortData) {
        return this.cohortModel.create(cohortData);
    }
    async update(id, organizationId, updateData) {
        return this.cohortModel
            .findOneAndUpdate({ _id: id, organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: updateData }, { new: true })
            .exec();
    }
    async softDelete(id, organizationId) {
        return this.cohortModel
            .findOneAndUpdate({ _id: id, organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { isActive: false }, { new: true })
            .exec();
    }
};
exports.CohortRepository = CohortRepository;
exports.CohortRepository = CohortRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cohort_schema_1.Cohort.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CohortRepository);
//# sourceMappingURL=cohort.repository.js.map