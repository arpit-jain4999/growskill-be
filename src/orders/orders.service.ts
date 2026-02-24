import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderRepository } from './repositories/order.repository';
import { LoggerService } from '../common/services/logger.service';
import { OrderStatus } from './schemas/order.schema';
import type { Actor } from '../common/types/actor';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, ConfirmPaymentDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepository: OrderRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('OrdersService');
  }

  /** List orders for the actor: tenant-scoped if organizationId present, else all user orders. */
  async findAll(actor: Actor) {
    if (actor.organizationId) {
      this.logger.log(`Fetching orders for user ${actor.userId} in org ${actor.organizationId}`);
      return this.orderRepository.findByUserIdAndOrg(actor.userId, actor.organizationId);
    }
    this.logger.log(`Fetching all orders for user: ${actor.userId}`);
    return this.orderRepository.findByUserId(actor.userId);
  }

  async findById(id: string, userId: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId.toString() !== userId) throw new NotFoundException('Order not found');
    return order;
  }

  /** Create order; requires tenant context (organizationId). */
  async create(actor: Actor, dto: CreateOrderDto) {
    if (!actor.organizationId) {
      throw new ForbiddenException('Organization context required to create an order');
    }
    const order = await this.orderRepository.create({
      organizationId: new Types.ObjectId(actor.organizationId),
      userId: new Types.ObjectId(actor.userId),
      courseId: dto.courseId ? new Types.ObjectId(dto.courseId) : undefined,
      cohortId: dto.cohortId ? new Types.ObjectId(dto.cohortId) : undefined,
      amount: dto.amount,
      status: OrderStatus.PENDING,
    });
    this.logger.log(`Created order ${order._id} for user ${actor.userId}`);
    return order;
  }

  /** Update order status (owner only). */
  async updateStatus(id: string, userId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId.toString() !== userId) throw new ForbiddenException('Not your order');
    if (!dto.status) return order;
    const updated = await this.orderRepository.updateStatus(id, { status: dto.status });
    this.logger.log(`Order ${id} status updated to ${dto.status}`);
    return updated!;
  }

  /** Confirm payment for an order (owner or called after payment success). */
  async confirmPayment(id: string, userId: string, dto: ConfirmPaymentDto) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId.toString() !== userId) throw new ForbiddenException('Not your order');
    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException(`Order is already ${order.status}`);
    }
    const updated = await this.orderRepository.updateStatus(id, {
      status: OrderStatus.COMPLETED,
      paymentId: dto.paymentId,
      transactionId: dto.transactionId,
      paymentMethod: dto.paymentMethod,
    });
    this.logger.log(`Order ${id} payment confirmed`);
    return updated!;
  }

  /** Webhook: update order by id and status (no auth; validated by secret). */
  async processWebhook(orderId: string, status: OrderStatus, payload: { transactionId?: string; paymentId?: string; paymentMethod?: string }) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    await this.orderRepository.updateStatus(orderId, {
      status,
      transactionId: payload.transactionId,
      paymentId: payload.paymentId,
      paymentMethod: payload.paymentMethod,
    });
    this.logger.log(`Webhook: order ${orderId} -> ${status}`);
    return this.orderRepository.findById(orderId);
  }
}

