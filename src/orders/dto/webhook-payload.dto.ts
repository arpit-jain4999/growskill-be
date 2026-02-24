import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class OrderWebhookPayloadDto {
  @ApiProperty({
    description: 'Order ID (MongoDB ObjectId) to update',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    enum: OrderStatus,
    description: 'Status to set. Use `completed` on payment success, `refunded` on refund.',
    example: OrderStatus.COMPLETED,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Transaction ID from payment gateway',
    example: 'txn_xyz789',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Payment provider payment ID',
    example: 'pay_abc123',
  })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiPropertyOptional({
    description: 'Payment method (e.g. card, upi)',
    example: 'upi',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
