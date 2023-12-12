import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { orderProviders } from './order.providers';
import { DatabaseModule } from '../database/database.module';
import { OrderController } from './order.controller';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [DatabaseModule, NotificationModule],
  providers: [OrderService, ...orderProviders],
  controllers: [OrderController],
})
export class OrderModule {}
