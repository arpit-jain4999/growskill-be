import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from '../schemas/notification.schema';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async findByUserId(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async findUnreadByUserId(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel.find({ 
      userId: new Types.ObjectId(userId), 
      isRead: false 
    }).sort({ createdAt: -1 });
  }

  async markAsRead(id: string, userId: string): Promise<NotificationDocument | null> {
    return this.notificationModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      { isRead: true },
      { new: true }
    );
  }
}

