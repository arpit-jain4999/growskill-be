import { NotificationRepository } from './repositories/notification.repository';
import { LoggerService } from '../common/services/logger.service';
export declare class NotificationsService {
    private notificationRepository;
    private logger;
    constructor(notificationRepository: NotificationRepository, logger: LoggerService);
    findAll(userId: string): Promise<import("./schemas/notification.schema").NotificationDocument[]>;
    findUnread(userId: string): Promise<import("./schemas/notification.schema").NotificationDocument[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("./schemas/notification.schema").NotificationDocument>;
}
