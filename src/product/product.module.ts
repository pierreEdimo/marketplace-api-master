import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { DatabaseModule } from '../database/database.module';
import { ProductController } from './product.controller';
import { productProviders } from './product.providers';

@Module({
  imports: [DatabaseModule],
  providers: [ProductService, ...productProviders],
  controllers: [ProductController],
})
export class ProductModule {}
