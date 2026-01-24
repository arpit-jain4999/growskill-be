import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepository: OrderRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('OrdersService');
  }

  async findAll(userId: string) {
    this.logger.log(`Fetching orders for user: ${userId}`);
    return this.orderRepository.findByUserId(userId);
  }

  async findById(id: string, userId: string) {
    this.logger.log(`Fetching order: ${id} for user: ${userId}`);
    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify order belongs to user
    if (order.userId.toString() !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}

