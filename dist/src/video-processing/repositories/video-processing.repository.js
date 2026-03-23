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
exports.VideoProcessingRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_processing_schema_1 = require("../schemas/video-processing.schema");
let VideoProcessingRepository = class VideoProcessingRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findById(id) {
        if (!id || !mongoose_2.Types.ObjectId.isValid(id))
            return null;
        return this.model.findById(id);
    }
    async updateStatus(id, status, data) {
        const update = { status };
        if (data?.masterPlaylistUrl != null)
            update.masterPlaylistUrl = data.masterPlaylistUrl;
        if (data?.errorMessage != null)
            update.errorMessage = data.errorMessage;
        if (data?.durationSeconds != null)
            update.durationSeconds = data.durationSeconds;
        return this.model
            .findByIdAndUpdate(id, { $set: update }, { new: true })
            .exec();
    }
};
exports.VideoProcessingRepository = VideoProcessingRepository;
exports.VideoProcessingRepository = VideoProcessingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_processing_schema_1.VideoProcessing.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VideoProcessingRepository);
//# sourceMappingURL=video-processing.repository.js.map