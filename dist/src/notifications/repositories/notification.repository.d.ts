import { Model } from 'mongoose';
import { NotificationDocument } from '../schemas/notification.schema';
export declare class NotificationRepository {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    findByUserId(userId: string): Promise<NotificationDocument[]>;
    findUnreadByUserId(userId: string): Promise<NotificationDocument[]>;
    markAsRead(id: string, userId: string): Promise<NotificationDocument | null>;
}
