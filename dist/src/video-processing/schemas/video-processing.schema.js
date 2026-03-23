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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoProcessingSchema = exports.VideoProcessing = exports.VIDEO_PROCESSING_STATUS = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
exports.VIDEO_PROCESSING_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
};
let VideoProcessing = class VideoProcessing {
};
exports.VideoProcessing = VideoProcessing;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'FileInfo', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VideoProcessing.prototype, "sourceFileId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: Object.values(exports.VIDEO_PROCESSING_STATUS), default: exports.VIDEO_PROCESSING_STATUS.PENDING }),
    __metadata("design:type", String)
], VideoProcessing.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VideoProcessing.prototype, "masterPlaylistUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Chapter' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VideoProcessing.prototype, "chapterId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Module' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VideoProcessing.prototype, "moduleId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VideoProcessing.prototype, "errorMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VideoProcessing.prototype, "durationSeconds", void 0);
exports.VideoProcessing = VideoProcessing = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VideoProcessing);
exports.VideoProcessingSchema = mongoose_1.SchemaFactory.createForClass(VideoProcessing);
exports.VideoProcessingSchema.index({ sourceFileId: 1 });
exports.VideoProcessingSchema.index({ chapterId: 1 });
exports.VideoProcessingSchema.index({ moduleId: 1 });
exports.VideoProcessingSchema.index({ status: 1 });
//# sourceMappingURL=video-processing.schema.js.map