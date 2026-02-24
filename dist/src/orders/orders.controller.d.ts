import { OrdersService } from './orders.service';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Actor } from '../common/types/actor';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, ConfirmPaymentDto } from './dto/update-order.dto';
import { OrderWebhookPayloadDto } from './dto/webhook-payload.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(actor: Actor): Promise<import("./schemas/order.schema").OrderDocument[]>;
    create(actor: Actor, dto: CreateOrderDto): Promise<import("./schemas/order.schema").OrderDocument>;
    webhook(dto: OrderWebhookPayloadDto): Promise<import("./schemas/order.schema").OrderDocument>;
    findOne(id: string, user: CurrentUserPayload): Promise<import("./schemas/order.schema").OrderDocument>;
    updateStatus(id: string, user: CurrentUserPayload, dto: UpdateOrderStatusDto): Promise<import("./schemas/order.schema").OrderDocument>;
    confirmPayment(id: string, user: CurrentUserPayload, dto: ConfirmPaymentDto): Promise<import("./schemas/order.schema").OrderDocument>;
}
