import { OrderStatus } from '../schemas/order.schema';
export declare class UpdateOrderStatusDto {
    status?: OrderStatus;
}
export declare class ConfirmPaymentDto {
    paymentId?: string;
    transactionId?: string;
    paymentMethod?: string;
}
