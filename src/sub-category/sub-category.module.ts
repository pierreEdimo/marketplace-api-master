import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SubCategoryService } from './sub-category.service';
import { subCategoryProviders } from './sub-category.providers';
import { SubCategoryController } from './sub-category.controller';

@Module({
  imports: [DatabaseModule],
  providers: [SubCategoryService, ...subCategoryProviders],
  controllers: [SubCategoryController],
})
export class SubCategoryModule {}
