import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class NotificationsService {
  constructor(
    private notificationRepository: NotificationRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('NotificationsService');
  }

  async findAll(userId: string) {
    this.logger.log(`Fetching notifications for user: ${userId}`);
    return this.notificationRepository.findByUserId(userId);
  }

  async findUnread(userId: string) {
    this.logger.log(`Fetching unread notifications for user: ${userId}`);
    return this.notificationRepository.findUnreadByUserId(userId);
  }

  async markAsRead(notificationId: string, userId: string) {
    this.logger.log(`Marking notification ${notificationId} as read for user: ${userId}`);
    const notification = await this.notificationRepository.markAsRead(notificationId, userId);
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}

