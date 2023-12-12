import { CategoryService } from './category.service';
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
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './create.category.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('/random/:size')
  async getRandomCategories(@Param('size', ParseIntPipe) size: number) {
    return await this.categoryService.getRandomCategories(size);
  }

  @Get('/limit/:size')
  async getCategoriesWithLimit(@Param('size', ParseIntPipe) size: number) {
    return await this.categoryService.getCategoriesWithLimit(size);
  }

  @Get('/search')
  async searchCategory(@Query('word') word: string) {
    return await this.categoryService.searchCategories(word);
  }

  @Post()
  async createNewCategory(@Body() category: CreateCategoryDto) {
    return await this.categoryService.createCategory(category);
  }

  @Get(':id')
  async getSingleCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getSingleCategory(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteCategory(id);
  }

  @Put(':id')
  @HttpCode(204)
  async editCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryDto: CreateCategoryDto,
  ) {
    return await this.categoryService.editCategory(id, categoryDto);
  }
}
