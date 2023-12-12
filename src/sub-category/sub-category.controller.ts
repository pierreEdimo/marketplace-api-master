import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategory } from './create.sub-category';
import { ApiTags } from '@nestjs/swagger';

@Controller('sub-categories')
@ApiTags('Sub-Categories')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Get(':id')
  async getSingleCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.subCategoryService.getSingleCategory(id);
  }

  @Post()
  async createCategory(@Body() category: CreateSubCategory) {
    return await this.subCategoryService.createCategory(category);
  }

  @Get('/categories/:id')
  async getCategoriesByParentCategoryId(@Param('id', ParseIntPipe) id: number) {
    return await this.subCategoryService.getCategoriesByParentCategoryId(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.subCategoryService.deleteCategory(id);
  }

  @Get()
  async getAllCategories() {
    return await this.subCategoryService.getAllCategories();
  }

  @Put(':id')
  @HttpCode(204)
  async editCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() subCategory: CreateSubCategory,
  ) {
    return await this.subCategoryService.editCategory(id, subCategory);
  }
}
