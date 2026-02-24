import { OrderRepository } from './repositories/order.repository';
import { LoggerService } from '../common/services/logger.service';
import { OrderStatus } from './schemas/order.schema';
import type { Actor } from '../common/types/actor';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, ConfirmPaymentDto } from './dto/update-order.dto';
export declare class OrdersService {
    private orderRepository;
    private logger;
    constructor(orderRepository: OrderRepository, logger: LoggerService);
    findAll(actor: Actor): Promise<import("./schemas/order.schema").OrderDocument[]>;
    findById(id: string, userId: string): Promise<import("./schemas/order.schema").OrderDocument>;
    create(actor: Actor, dto: CreateOrderDto): Promise<import("./schemas/order.schema").OrderDocument>;
    updateStatus(id: string, userId: string, dto: UpdateOrderStatusDto): Promise<import("./schemas/order.schema").OrderDocument>;
    confirmPayment(id: string, userId: string, dto: ConfirmPaymentDto): Promise<import("./schemas/order.schema").OrderDocument>;
    processWebhook(orderId: string, status: OrderStatus, payload: {
        transactionId?: string;
        paymentId?: string;
        paymentMethod?: string;
    }): Promise<import("./schemas/order.schema").OrderDocument>;
}
