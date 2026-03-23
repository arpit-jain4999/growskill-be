"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoProcessingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const video_processing_schema_1 = require("./schemas/video-processing.schema");
const video_processing_repository_1 = require("./repositories/video-processing.repository");
const video_processing_service_1 = require("./video-processing.service");
const video_processing_controller_1 = require("./video-processing.controller");
const files_module_1 = require("../files/files.module");
const chapters_module_1 = require("../chapters/chapters.module");
const modules_module_1 = require("../modules/modules.module");
let VideoProcessingModule = class VideoProcessingModule {
};
exports.VideoProcessingModule = VideoProcessingModule;
exports.VideoProcessingModule = VideoProcessingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: video_processing_schema_1.VideoProcessing.name, schema: video_processing_schema_1.VideoProcessingSchema },
            ]),
            (0, common_1.forwardRef)(() => files_module_1.FilesModule),
            chapters_module_1.ChaptersModule,
            modules_module_1.ModulesModule,
        ],
        controllers: [video_processing_controller_1.VideoProcessingController],
        providers: [video_processing_repository_1.VideoProcessingRepository, video_processing_service_1.VideoProcessingService],
        exports: [video_processing_service_1.VideoProcessingService],
    })
], VideoProcessingModule);
//# sourceMappingURL=video-processing.module.js.map