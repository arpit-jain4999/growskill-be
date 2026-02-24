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
exports.UpdateCohortDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateCohortDto {
}
exports.UpdateCohortDto = UpdateCohortDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated Cohort Name', description: 'Cohort name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCohortDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cohort icons for mobile and web',
        example: {
            mobile: { name: 'icon.png', key: 'cohorts/icons/mobile/icon.png', baseUrl: 'https://cdn.example.com', imgUrl: 'https://cdn.example.com/cohorts/icons/mobile/icon.png' },
            web: { name: 'icon.png', key: 'cohorts/icons/web/icon.png', baseUrl: 'https://cdn.example.com', imgUrl: 'https://cdn.example.com/cohorts/icons/web/icon.png' }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateCohortDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2, description: 'Display order' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCohortDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'US', description: 'Country code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCohortDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, description: 'Visible on home page' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCohortDto.prototype, "isVisibleOnHomePage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated description', description: 'Cohort description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCohortDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-02-01T00:00:00Z', description: 'Start date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateCohortDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-11-30T00:00:00Z', description: 'End date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateCohortDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, description: 'Is active' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCohortDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-cohort.dto.js.map