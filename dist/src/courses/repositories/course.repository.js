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
exports.CourseRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("../schemas/course.schema");
let CourseRepository = class CourseRepository {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    async findAll(filter) {
        const query = {
            organizationId: new mongoose_2.Types.ObjectId(filter.organizationId),
            isPublished: true,
        };
        if (filter.name?.trim()) {
            query.title = { $regex: filter.name.trim(), $options: 'i' };
        }
        if (filter.cohortId) {
            query.cohortId = new mongoose_2.Types.ObjectId(filter.cohortId);
        }
        return this.courseModel.find(query);
    }
    async findAllForAdmin(organizationId) {
        return this.courseModel
            .find({ organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .sort({ createdAt: -1 });
    }
    async findById(id, organizationId) {
        const q = { _id: id };
        if (organizationId) {
            q.organizationId = new mongoose_2.Types.ObjectId(organizationId);
        }
        return this.courseModel.findOne(q);
    }
    async findByUserId(userId, organizationId) {
        return this.courseModel.find({
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            instructorId: new mongoose_2.Types.ObjectId(userId),
        });
    }
    async create(data) {
        return this.courseModel.create(data);
    }
    async update(id, organizationId, data) {
        return this.courseModel
            .findOneAndUpdate({ _id: id, organizationId: new mongoose_2.Types.ObjectId(organizationId) }, { $set: data }, { new: true })
            .exec();
    }
    async delete(id, organizationId) {
        return this.courseModel
            .findOneAndDelete({ _id: id, organizationId: new mongoose_2.Types.ObjectId(organizationId) })
            .exec();
    }
};
exports.CourseRepository = CourseRepository;
exports.CourseRepository = CourseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CourseRepository);
//# sourceMappingURL=course.repository.js.map