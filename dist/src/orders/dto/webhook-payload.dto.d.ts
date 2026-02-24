import { OrderStatus } from '../schemas/order.schema';
export declare class OrderWebhookPayloadDto {
    orderId: string;
    status: OrderStatus;
    transactionId?: string;
    paymentId?: string;
    paymentMethod?: string;
}
