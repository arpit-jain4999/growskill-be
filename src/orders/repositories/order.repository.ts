import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async findByUserIdAndOrg(userId: string, organizationId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({
        userId: new Types.ObjectId(userId),
        organizationId: new Types.ObjectId(organizationId),
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return this.orderModel.findById(id).exec();
  }

  async create(orderData: Partial<Order>): Promise<OrderDocument> {
    return this.orderModel.create(orderData);
  }

  async updateStatus(
    id: string,
    updates: { status?: OrderStatus; paymentId?: string; paymentMethod?: string; transactionId?: string },
  ): Promise<OrderDocument | null> {
    return this.orderModel
      .findByIdAndUpdate(id, { $set: updates }, { new: true })
      .exec();
  }
}

