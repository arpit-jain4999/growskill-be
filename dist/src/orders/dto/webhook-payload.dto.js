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
exports.OrderWebhookPayloadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const order_schema_1 = require("../schemas/order.schema");
class OrderWebhookPayloadDto {
}
exports.OrderWebhookPayloadDto = OrderWebhookPayloadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order ID (MongoDB ObjectId) to update',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderWebhookPayloadDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: order_schema_1.OrderStatus,
        description: 'Status to set. Use `completed` on payment success, `refunded` on refund.',
        example: order_schema_1.OrderStatus.COMPLETED,
    }),
    (0, class_validator_1.IsEnum)(order_schema_1.OrderStatus),
    __metadata("design:type", String)
], OrderWebhookPayloadDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Transaction ID from payment gateway',
        example: 'txn_xyz789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderWebhookPayloadDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment provider payment ID',
        example: 'pay_abc123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderWebhookPayloadDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment method (e.g. card, upi)',
        example: 'upi',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderWebhookPayloadDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=webhook-payload.dto.js.map