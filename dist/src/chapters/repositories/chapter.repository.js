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
exports.ChapterRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chapter_schema_1 = require("../schemas/chapter.schema");
let ChapterRepository = class ChapterRepository {
    constructor(chapterModel) {
        this.chapterModel = chapterModel;
    }
    async findAll() {
        return this.chapterModel.find({ isActive: true }).sort({ order: 1 });
    }
    async findAllForAdmin(organizationId) {
        return this.chapterModel
            .find({ organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .sort({ order: 1, createdAt: -1 });
    }
    async findById(id, organizationId) {
        const q = { _id: id };
        if (organizationId) {
            q.organizationId = new mongoose_2.Types.ObjectId(organizationId);
        }
        return this.chapterModel.findOne(q);
    }
    async findByModuleId(moduleId) {
        return this.chapterModel
            .find({ moduleId: new mongoose_2.Types.ObjectId(moduleId), isActive: true })
            .sort({ order: 1 });
    }
    async findByModuleIdForAdmin(moduleId, organizationId) {
        return this.chapterModel
            .find({
            moduleId: new mongoose_2.Types.ObjectId(moduleId),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
        })
            .sort({ order: 1, createdAt: -1 });
    }
    async create(data) {
        return this.chapterModel.create(data);
    }
    async update(id, organizationId, data) {
        return this.chapterModel
            .findOneAndUpdate({ _id: id, organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: data }, { new: true })
            .exec();
    }
    async delete(id, organizationId) {
        return this.chapterModel
            .findOneAndDelete({ _id: id, organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .exec();
    }
    async deleteByModuleId(moduleId, organizationId) {
        const result = await this.chapterModel.deleteMany({
            moduleId: new mongoose_2.Types.ObjectId(moduleId),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
        });
        return result.deletedCount ?? 0;
    }
};
exports.ChapterRepository = ChapterRepository;
exports.ChapterRepository = ChapterRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chapter_schema_1.Chapter.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChapterRepository);
//# sourceMappingURL=chapter.repository.js.map