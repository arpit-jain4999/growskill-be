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
exports.CourseListApiResponseDto = exports.CourseApiResponseDto = exports.CourseResponseDto = exports.FeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FeeDto {
}
exports.FeeDto = FeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 999,
        description: 'Fee amount in smallest currency unit',
        type: Number,
    }),
    __metadata("design:type", Number)
], FeeDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        description: 'Discount in smallest currency unit',
        type: Number,
    }),
    __metadata("design:type", Number)
], FeeDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 899,
        description: 'Total payable (amount - discount)',
        type: Number,
    }),
    __metadata("design:type", Number)
], FeeDto.prototype, "total", void 0);
class CourseResponseDto {
}
exports.CourseResponseDto = CourseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'Course ID',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Introduction to Node.js',
        description: 'Course title',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Learn Node.js from scratch with hands-on projects',
        description: 'Course description',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439012',
        description: 'Instructor user ID',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "instructorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Course fee: amount, discount, and total (amount - discount)',
        type: () => FeeDto,
    }),
    __metadata("design:type", FeeDto)
], CourseResponseDto.prototype, "fee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '507f1f77bcf86cd799439013',
        description: 'Cohort ID when course belongs to a cohort',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "cohortId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the course is published and visible',
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], CourseResponseDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 42,
        description: 'Number of enrolled students',
        type: Number,
    }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "enrollmentCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://cdn.example.com/courses/node-thumb.png',
        description: 'Course thumbnail URL',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Backend Development',
        description: 'Course category',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 4.5,
        description: 'Average rating (0–5)',
        type: Number,
    }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 128,
        description: 'Total number of ratings',
        type: Number,
    }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "totalRatings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-15T10:00:00.000Z',
        description: 'Creation timestamp',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-20T14:30:00.000Z',
        description: 'Last update timestamp',
        type: String,
    }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "updatedAt", void 0);
class CourseApiResponseDto {
}
exports.CourseApiResponseDto = CourseApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Indicates the request succeeded',
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], CourseApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The course object',
        type: CourseResponseDto,
    }),
    __metadata("design:type", CourseResponseDto)
], CourseApiResponseDto.prototype, "data", void 0);
class CourseListApiResponseDto {
}
exports.CourseListApiResponseDto = CourseListApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Indicates the request succeeded',
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], CourseListApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of published courses. Each item has _id, title, fee, cohortId, etc.',
        type: () => CourseResponseDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], CourseListApiResponseDto.prototype, "data", void 0);
//# sourceMappingURL=course-response.dto.js.map