import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    DatabaseModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule,
    OrderModule,
    NotificationModule, 
    LocationModule
  ],
})
export class AppModule {}
