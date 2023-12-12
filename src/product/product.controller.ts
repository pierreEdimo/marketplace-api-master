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
import { ProductService } from './product.service';
import { CreateProductDto } from './create.product.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':sku/users/:userId')
  async getProductBySkuAndIsFavorite(
    @Param('sku') sku: string,
    @Param('userId') userId: string,
  ) {
    return this.productService.getProductBySkuAndIsFavorite(sku, userId);
  }

  @Get(':sku')
  async getProductBySku(@Param('sku') productSku: string) {
    return this.productService.getProductBySku(productSku);
  }

  @Get('locations/:id')
  async getProductsByLocationId(
    @Param('id') luid: string,
    @Query('size') size: number,
  ) {
    return this.productService.getProductsByLocationId(luid, size);
  }

  @Get('categories/:id')
  async getProductsByCategoryId(
    @Param('id') cid: number,
    @Query('size') size: number,
  ) {
    return this.productService.getProductsByCategoryId(cid, size);
  }

  @Get('count/locations/:id')
  async getProductCountByLuid(@Param('id') luid: string) {
    return this.productService.getProductCountByLocationId(luid);
  }

  @Get('favorites/:userId')
  async getFavoritesProducts(@Param('userId') userId: string) {
    return this.productService.filterFavoritesProduct(userId);
  }

  @Post('favorites/:id/users/:userId')
  async addProductToFavorite(
    @Param('id') id: number,
    @Param('userId') userId: string,
  ) {
    return this.productService.addAndRemoveProductToFromFavorite(id, userId);
  }

  @Get('subCategories/:id')
  async getProductBySubCategory(
    @Param('id') id: number,
    @Query('size') size: number,
  ) {
    return this.productService.getProductsBySubCategoryId(id, size);
  }

  @Get('random/locations/:id')
  async getRandomProductsByLocationId(
    @Param('id') luid: string,
    @Query('size') size: number,
  ) {
    return this.productService.getRandomProductsByLocationId(luid, size);
  }

  @Get('random/categories/:id')
  async getRandomProductsByCategoryId(
    @Param('id') cid: number,
    @Query('size') size: number,
  ) {
    return this.productService.getRandomProductsByCategoryId(cid, size);
  }

  @Post()
  async createProduct(@Body() product: CreateProductDto) {
    return this.productService.createProduct(product);
  }

  @Get('filter/search/:word')
  async searchProducts(@Param('word') word: string) {
    return this.productService.filterProducts(word);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Put(':id')
  @HttpCode(204)
  async editProduct(
    @Param('id') id: number,
    @Body() product: CreateProductDto,
  ) {
    return this.productService.editProduct(id, product);
  }

  @Get('limit/:size')
  async getProductsWithLimits(@Param('size', ParseIntPipe) size: number) {
    return this.productService.getProductsWithLimit(size);
  }
}
