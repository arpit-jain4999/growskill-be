import { OrderStatus } from '../schemas/order.schema';
export declare class OrderResponseDto {
    _id: string;
    organizationId: string;
    userId: string;
    courseId?: string;
    cohortId?: string;
    amount: number;
    status: OrderStatus;
    paymentId?: string;
    paymentMethod?: string;
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
}
