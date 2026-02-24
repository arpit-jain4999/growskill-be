import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderRepository } from './repositories/order.repository';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderWebhookGuard } from './guards/order-webhook.guard';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    OrganizationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, OrderWebhookGuard],
  exports: [OrdersService],
})
export class OrdersModule {}

