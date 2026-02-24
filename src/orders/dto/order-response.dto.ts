import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../schemas/order.schema';

/**
 * Order entity as returned by the API. All responses are wrapped as { success: true, data: T }.
 */
export class OrderResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Order ID (MongoDB ObjectId)',
  })
  _id: string;

  @ApiProperty({
    example: '698b0f6076ca77d98d706e65',
    description: 'Organization ID this order belongs to',
  })
  organizationId: string;

  @ApiProperty({
    example: '698b0faa76ca77d98d706e8c',
    description: 'User ID who placed the order',
  })
  userId: string;

  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439012',
    description: 'Course ID if order is for a course',
  })
  courseId?: string;

  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439013',
    description: 'Cohort ID if order is for a cohort',
  })
  cohortId?: string;

  @ApiProperty({
    example: 99900,
    description: 'Order amount in smallest currency unit (e.g. paise for INR)',
  })
  amount: number;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'Order status: pending | completed | cancelled | refunded',
  })
  status: OrderStatus;

  @ApiPropertyOptional({
    example: 'pay_abc123',
    description: 'Payment provider payment/order ID',
  })
  paymentId?: string;

  @ApiPropertyOptional({
    example: 'upi',
    description: 'Payment method (e.g. card, upi, netbanking)',
  })
  paymentMethod?: string;

  @ApiPropertyOptional({
    example: 'txn_xyz789',
    description: 'Transaction ID from payment gateway',
  })
  transactionId?: string;

  @ApiProperty({
    example: '2025-02-10T10:30:00.000Z',
    description: 'Order creation timestamp (ISO 8601)',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-02-10T10:30:00.000Z',
    description: 'Last update timestamp (ISO 8601)',
  })
  updatedAt: string;
}
