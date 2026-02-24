import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiParam,
  ApiExtraModels,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantContextGuard } from '../common/guards/tenant-context.guard';
import { RequireTenantGuard } from '../common/guards/tenant-context.guard';
import { CurrentActor } from '../common/decorators/current-actor.decorator';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Actor } from '../common/types/actor';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, ConfirmPaymentDto } from './dto/update-order.dto';
import { OrderWebhookPayloadDto } from './dto/webhook-payload.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderWebhookGuard } from './guards/order-webhook.guard';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Orders')
@ApiExtraModels(OrderResponseDto, CreateOrderDto, UpdateOrderStatusDto, ConfirmPaymentDto, OrderWebhookPayloadDto, StandardErrorResponseDto)
@Controller('v1/orders')
@UseGuards(JwtAuthGuard, TenantContextGuard)
@ApiBearerAuth('JWT-auth')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'List my orders',
    description:
      'Returns orders for the authenticated user. When **x-org-id** is sent, only orders for that organisation are returned; otherwise all orders for the user (e.g. for platform owner). Response: `{ success: true, data: Order[] }`.',
  })
  @ApiHeader({
    name: 'x-org-id',
    required: false,
    description: 'Organization ID (MongoDB ObjectId). When provided, response is tenant-scoped to this org.',
  })
  @ApiOkResponse({
    description: 'List of orders. Response body: { success: true, data: OrderResponseDto[] }',
    schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/OrderResponseDto' } } } },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  async findAll(@CurrentActor() actor: Actor) {
    return this.ordersService.findAll(actor);
  }

  @Post()
  @UseGuards(RequireTenantGuard)
  @ApiOperation({
    summary: 'Create order',
    description:
      'Creates a new order in **PENDING** status. Requires **x-org-id** header (tenant context). Amount is in smallest currency unit (e.g. paise for INR). Optional courseId/cohortId link the order to a course or cohort.',
  })
  @ApiHeader({
    name: 'x-org-id',
    required: true,
    description: 'Organization ID (MongoDB ObjectId). Required to create an order.',
  })
  @ApiCreatedResponse({
    description: 'Order created. Response body: { success: true, data: OrderResponseDto }',
    schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
  })
  @ApiBadRequestResponse({ description: 'Validation error (e.g. invalid body)', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Organization context required (missing or invalid x-org-id)', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  async create(@CurrentActor() actor: Actor, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(actor, dto);
  }

  @Public()
  @Post('webhook')
  @UseGuards(OrderWebhookGuard)
  @ApiOperation({
    summary: 'Payment webhook',
    description:
      'Called by the payment provider to update order status (e.g. completed, refunded). **No JWT.** Requires header **x-webhook-secret** equal to server env `ORDER_WEBHOOK_SECRET`. Response: `{ success: true, data: OrderResponseDto }`.',
  })
  @ApiHeader({
    name: 'x-webhook-secret',
    required: true,
    description: 'Must match server env ORDER_WEBHOOK_SECRET. Used to authenticate webhook calls.',
  })
  @ApiCreatedResponse({
    description: 'Order updated. Response body: { success: true, data: OrderResponseDto }',
    schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
  })
  @ApiNotFoundResponse({ description: 'Order not found', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid x-webhook-secret', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid body (e.g. invalid orderId or status)', type: StandardErrorResponseDto })
  async webhook(@Body() dto: OrderWebhookPayloadDto) {
    return this.ordersService.processWebhook(dto.orderId, dto.status, {
      transactionId: dto.transactionId,
      paymentId: dto.paymentId,
      paymentMethod: dto.paymentMethod,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Returns a single order. Only the order owner can access. Response: `{ success: true, data: OrderResponseDto }`.',
  })
  @ApiParam({ name: 'id', description: 'Order ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({
    description: 'Order. Response body: { success: true, data: OrderResponseDto }',
    schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
  })
  @ApiNotFoundResponse({ description: 'Order not found or not owned by you', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.ordersService.findById(id, user.userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update order status',
    description: 'Updates order status (e.g. cancel: set status to `cancelled`). Only the order owner can update. Response: `{ success: true, data: OrderResponseDto }`.',
  })
  @ApiParam({ name: 'id', description: 'Order ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({
    description: 'Order updated. Response body: { success: true, data: OrderResponseDto }',
    schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
  })
  @ApiNotFoundResponse({ description: 'Order not found', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Not your order', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error (e.g. invalid status)', type: StandardErrorResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, user.userId, dto);
  }

  @Post(':id/confirm-payment')
  @ApiOperation({
    summary: 'Confirm payment',
    description:
      'Marks order as **completed** and stores payment details. Only for orders in **pending** status; only the order owner. Use after client-side payment success or as a fallback. For provider callbacks use **POST /v1/orders/webhook** instead. Response: `{ success: true, data: OrderResponseDto }`.',
  })
  @ApiParam({ name: 'id', description: 'Order ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({
    description: 'Order payment confirmed. Response body: { success: true, data: OrderResponseDto }',
    schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/OrderResponseDto' } } },
  })
  @ApiNotFoundResponse({ description: 'Order not found', type: StandardErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Not your order or order is not pending', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  async confirmPayment(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.ordersService.confirmPayment(id, user.userId, dto);
  }
}
