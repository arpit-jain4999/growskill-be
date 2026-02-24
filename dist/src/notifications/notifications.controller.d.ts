import { NotificationsService } from './notifications.service';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: CurrentUserPayload): Promise<import("./schemas/notification.schema").NotificationDocument[]>;
    findUnread(user: CurrentUserPayload): Promise<import("./schemas/notification.schema").NotificationDocument[]>;
    markAsRead(id: string, user: CurrentUserPayload): Promise<import("./schemas/notification.schema").NotificationDocument>;
}
