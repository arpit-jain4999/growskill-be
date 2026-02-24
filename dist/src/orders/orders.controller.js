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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_context_guard_1 = require("../common/guards/tenant-context.guard");
const tenant_context_guard_2 = require("../common/guards/tenant-context.guard");
const current_actor_decorator_1 = require("../common/decorators/current-actor.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const webhook_payload_dto_1 = require("./dto/webhook-payload.dto");
const order_response_dto_1 = require("./dto/order-response.dto");
const order_webhook_guard_1 = require("./guards/order-webhook.guard");
const error_response_dto_1 = require("../common/dto/error-response.dto");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async findAll(actor) {
        return this.ordersService.findAll(actor);
    }
    async create(actor, dto) {
        return this.ordersService.create(actor, dto);
    }
    async webhook(dto) {
        return this.ordersService.processWebhook(dto.orderId, dto.status, {
            transactionId: dto.transactionId,
            paymentId: dto.paymentId,
            paymentMethod: dto.paymentMethod,
        });
    }
    async findOne(id, user) {
        return this.ordersService.findById(id, user.userId);
    }
    async updateStatus(id, user, dto) {
        return this.ordersService.updateStatus(id, user.userId, dto);
    }
    async confirmPayment(id, user, dto) {
        return this.ordersService.confirmPayment(id, user.userId, dto);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List my orders',
        description: 'Returns orders for the authenticated user. When **x-org-id** is sent, only orders for that organisation are returned; otherwise all orders for the user (e.g. for platform owner). Response: `{ success: true, data: Order[] }`.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-org-id',
        required: false,
        description: 'Organization ID (MongoDB ObjectId). When provided, response is tenant-scoped to this org.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of orders. Response body: { success: true, data: OrderResponseDto[] }',
        schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/OrderResponseDto' } } } },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(tenant_context_guard_2.RequireTenantGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create order',
        description: 'Creates a new order in **PENDING** status. Requires **x-org-id** header (tenant context). Amount is in smallest currency unit (e.g. paise for INR). Optional courseId/cohortId link the order to a course or cohort.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-org-id',
        required: true,
        description: 'Organization ID (MongoDB ObjectId). Required to create an order.',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Order created. Response body: { success: true, data: OrderResponseDto }',
        schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error (e.g. invalid body)', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Organization context required (missing or invalid x-org-id)', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, current_actor_decorator_1.CurrentActor)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('webhook'),
    (0, common_1.UseGuards)(order_webhook_guard_1.OrderWebhookGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Payment webhook',
        description: 'Called by the payment provider to update order status (e.g. completed, refunded). **No JWT.** Requires header **x-webhook-secret** equal to server env `ORDER_WEBHOOK_SECRET`. Response: `{ success: true, data: OrderResponseDto }`.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-webhook-secret',
        required: true,
        description: 'Must match server env ORDER_WEBHOOK_SECRET. Used to authenticate webhook calls.',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Order updated. Response body: { success: true, data: OrderResponseDto }',
        schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid x-webhook-secret', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid body (e.g. invalid orderId or status)', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [webhook_payload_dto_1.OrderWebhookPayloadDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "webhook", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get order by ID',
        description: 'Returns a single order. Only the order owner can access. Response: `{ success: true, data: OrderResponseDto }`.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Order. Response body: { success: true, data: OrderResponseDto }',
        schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found or not owned by you', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update order status',
        description: 'Updates order status (e.g. cancel: set status to `cancelled`). Only the order owner can update. Response: `{ success: true, data: OrderResponseDto }`.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Order updated. Response body: { success: true, data: OrderResponseDto }',
        schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Not your order', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error (e.g. invalid status)', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/confirm-payment'),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm payment',
        description: 'Marks order as **completed** and stores payment details. Only for orders in **pending** status; only the order owner. Use after client-side payment success or as a fallback. For provider callbacks use **POST /v1/orders/webhook** instead. Response: `{ success: true, data: OrderResponseDto }`.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Order payment confirmed. Response body: { success: true, data: OrderResponseDto }',
        schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Not your order or order is not pending', type: error_response_dto_1.StandardErrorResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid JWT', type: error_response_dto_1.StandardErrorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_order_dto_1.ConfirmPaymentDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "confirmPayment", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiExtraModels)(order_response_dto_1.OrderResponseDto, create_order_dto_1.CreateOrderDto, update_order_dto_1.UpdateOrderStatusDto, update_order_dto_1.ConfirmPaymentDto, webhook_payload_dto_1.OrderWebhookPayloadDto, error_response_dto_1.StandardErrorResponseDto),
    (0, common_1.Controller)('v1/orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_context_guard_1.TenantContextGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map