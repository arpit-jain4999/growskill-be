import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';
export declare class OrderRepository {
    private orderModel;
    constructor(orderModel: Model<OrderDocument>);
    findByUserId(userId: string): Promise<OrderDocument[]>;
    findByUserIdAndOrg(userId: string, organizationId: string): Promise<OrderDocument[]>;
    findById(id: string): Promise<OrderDocument | null>;
    create(orderData: Partial<Order>): Promise<OrderDocument>;
    updateStatus(id: string, updates: {
        status?: OrderStatus;
        paymentId?: string;
        paymentMethod?: string;
        transactionId?: string;
    }): Promise<OrderDocument | null>;
}
