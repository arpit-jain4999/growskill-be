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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const order_repository_1 = require("./repositories/order.repository");
const logger_service_1 = require("../common/services/logger.service");
const order_schema_1 = require("./schemas/order.schema");
let OrdersService = class OrdersService {
    constructor(orderRepository, logger) {
        this.orderRepository = orderRepository;
        this.logger = logger;
        this.logger.setContext('OrdersService');
    }
    async findAll(actor) {
        if (actor.organizationId) {
            this.logger.log(`Fetching orders for user ${actor.userId} in org ${actor.organizationId}`);
            return this.orderRepository.findByUserIdAndOrg(actor.userId, actor.organizationId);
        }
        this.logger.log(`Fetching all orders for user: ${actor.userId}`);
        return this.orderRepository.findByUserId(actor.userId);
    }
    async findById(id, userId) {
        const order = await this.orderRepository.findById(id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId.toString() !== userId)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async create(actor, dto) {
        if (!actor.organizationId) {
            throw new common_1.ForbiddenException('Organization context required to create an order');
        }
        const order = await this.orderRepository.create({
            organizationId: new mongoose_1.Types.ObjectId(actor.organizationId),
            userId: new mongoose_1.Types.ObjectId(actor.userId),
            courseId: dto.courseId ? new mongoose_1.Types.ObjectId(dto.courseId) : undefined,
            cohortId: dto.cohortId ? new mongoose_1.Types.ObjectId(dto.cohortId) : undefined,
            amount: dto.amount,
            status: order_schema_1.OrderStatus.PENDING,
        });
        this.logger.log(`Created order ${order._id} for user ${actor.userId}`);
        return order;
    }
    async updateStatus(id, userId, dto) {
        const order = await this.orderRepository.findById(id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId.toString() !== userId)
            throw new common_1.ForbiddenException('Not your order');
        if (!dto.status)
            return order;
        const updated = await this.orderRepository.updateStatus(id, { status: dto.status });
        this.logger.log(`Order ${id} status updated to ${dto.status}`);
        return updated;
    }
    async confirmPayment(id, userId, dto) {
        const order = await this.orderRepository.findById(id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId.toString() !== userId)
            throw new common_1.ForbiddenException('Not your order');
        if (order.status !== order_schema_1.OrderStatus.PENDING) {
            throw new common_1.ForbiddenException(`Order is already ${order.status}`);
        }
        const updated = await this.orderRepository.updateStatus(id, {
            status: order_schema_1.OrderStatus.COMPLETED,
            paymentId: dto.paymentId,
            transactionId: dto.transactionId,
            paymentMethod: dto.paymentMethod,
        });
        this.logger.log(`Order ${id} payment confirmed`);
        return updated;
    }
    async processWebhook(orderId, status, payload) {
        const order = await this.orderRepository.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        await this.orderRepository.updateStatus(orderId, {
            status,
            transactionId: payload.transactionId,
            paymentId: payload.paymentId,
            paymentMethod: payload.paymentMethod,
        });
        this.logger.log(`Webhook: order ${orderId} -> ${status}`);
        return this.orderRepository.findById(orderId);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_repository_1.OrderRepository,
        logger_service_1.LoggerService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map