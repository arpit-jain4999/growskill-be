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
exports.OrderResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const order_schema_1 = require("../schemas/order.schema");
class OrderResponseDto {
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'Order ID (MongoDB ObjectId)',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '698b0f6076ca77d98d706e65',
        description: 'Organization ID this order belongs to',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '698b0faa76ca77d98d706e8c',
        description: 'User ID who placed the order',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '507f1f77bcf86cd799439012',
        description: 'Course ID if order is for a course',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '507f1f77bcf86cd799439013',
        description: 'Cohort ID if order is for a cohort',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "cohortId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 99900,
        description: 'Order amount in smallest currency unit (e.g. paise for INR)',
    }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: order_schema_1.OrderStatus,
        example: order_schema_1.OrderStatus.PENDING,
        description: 'Order status: pending | completed | cancelled | refunded',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'pay_abc123',
        description: 'Payment provider payment/order ID',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'upi',
        description: 'Payment method (e.g. card, upi, netbanking)',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'txn_xyz789',
        description: 'Transaction ID from payment gateway',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-10T10:30:00.000Z',
        description: 'Order creation timestamp (ISO 8601)',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-02-10T10:30:00.000Z',
        description: 'Last update timestamp (ISO 8601)',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=order-response.dto.js.map