import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({
    enum: OrderStatus,
    description: 'New order status. Use `cancelled` to cancel, `refunded` after refund.',
    example: OrderStatus.CANCELLED,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class ConfirmPaymentDto {
  @ApiPropertyOptional({
    description: 'Payment provider order/payment ID (e.g. Razorpay order_id)',
    example: 'order_abc123xyz',
  })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiPropertyOptional({
    description: 'Transaction ID from payment gateway',
    example: 'txn_xyz789',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Payment method used: card, upi, netbanking, etc.',
    example: 'upi',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
