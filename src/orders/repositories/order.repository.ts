import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return this.orderModel.findById(id);
  }

  async create(orderData: Partial<Order>): Promise<OrderDocument> {
    return this.orderModel.create(orderData);
  }
}

