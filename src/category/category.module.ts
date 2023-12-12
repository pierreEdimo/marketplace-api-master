import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { categoryProviders } from './category.providers';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...categoryProviders, CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
