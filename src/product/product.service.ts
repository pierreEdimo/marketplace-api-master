import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductDto } from './product.dto';
import { CreateProductDto } from './create.product.dto';
import { Favorite } from './favorite';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<ProductDto[]> {
    const products: Product[] = await this.productRepository.find();
    const productDtos: ProductDto[] = [];
    for (const product of products) {
      productDtos.push(this.toProductDto(product, false));
    }
    return productDtos;
  }

  async createProduct(productoBeCreated: CreateProductDto): Promise<Product> {
    const product = new Product(
      productoBeCreated.name,
      productoBeCreated.description,
      productoBeCreated.imageUrl,
      productoBeCreated.weight,
      productoBeCreated.sellingPrice,
      productoBeCreated.locationUniqueId,
      productoBeCreated.categoryId,
      productoBeCreated.subCategoryId,
      productoBeCreated.productSku,
    );
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findOneById(id);
    if (!product) throw new NotFoundException('Product was not found');
    await this.productRepository.remove(product);
  }

  async editProduct(id: number, product: CreateProductDto): Promise<void> {
    const existingProduct = await this.productRepository.findOneById(id);
    if (!existingProduct) throw new NotFoundException('Product was not found');
    Object.assign(existingProduct, product);
    await this.productRepository.save(existingProduct);
  }

  async getRandomProductsByLocationId(
    id: string,
    size: number,
  ): Promise<ProductDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.locationUniqueId = :id', { id: id })
      .orderBy('RAND()')
      .limit(size)
      .getMany();
    const productDtos: ProductDto[] = [];
    for (const product of products) {
      productDtos.push(this.toProductDto(product, false));
    }
    return productDtos;
  }

  async getProductsByLocationId(
    id: string,
    size: number,
  ): Promise<ProductDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.locationUniqueId = :id', { id: id })
      .limit(size)
      .getMany();
    const productDtos: ProductDto[] = [];
    for (const product of products) {
      productDtos.push(this.toProductDto(product, false));
    }
    return productDtos;
  }

  async getRandomProductsByCategoryId(
    id: number,
    size: number,
  ): Promise<ProductDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.categoryId = :id', { id: id })
      .limit(size)
      .orderBy('RAND()')
      .getMany();
    const productDtos: ProductDto[] = [];
    for (const product of products) {
      productDtos.push(this.toProductDto(product, false));
    }
    return productDtos;
  }

  async getProductsByCategoryId(
    id: number,
    size: number,
  ): Promise<ProductDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.categoryId = :id', { id: id })
      .limit(size)
      .getMany();
    const productDtos: ProductDto[] = [];
    for (const product of products) {
      productDtos.push(this.toProductDto(product, false));
    }
    return productDtos;
  }

  async getProductsBySubCategoryId(
    id: number,
    size: number,
  ): Promise<ProductDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.subCategoryId = :id', { id: id })
      .limit(size != undefined ? size : 0)
      .getMany();
    const productDtos: ProductDto[] = [];
    for (const product of products) {
      productDtos.push(this.toProductDto(product, false));
    }
    return productDtos;
  }

  async getProductCountByLocationId(id: string): Promise<any> {
    const value = await this.productRepository
      .createQueryBuilder('product')
      .where('product.locationUniqueId = :id', { id: id })
      .getCount();
    return { value };
  }

  async addAndRemoveProductToFromFavorite(
    id: number,
    uid: string,
  ): Promise<Product> {
    const product: Product = await this.productRepository.findOneById(id);
    const favs: Favorite[] = [];
    if (!product) throw new NotFoundException('Product not found');
    const fav = new Favorite();
    fav.userId = uid;
    fav.isFavorite = true;
    if (product.favorites) {
      if (product.favorites.length >= 1) {
        if (product.favorites.some((x) => x.userId === uid)) {
          for (const favorite of product.favorites) {
            if (favorite.userId === uid && favorite.isFavorite) {
              favorite.isFavorite = false;
            } else if (favorite.userId === uid && !favorite.isFavorite) {
              favorite.isFavorite = true;
            }
          }
        } else {
          product.favorites.push(fav);
        }
      }
    } else {
      favs.push(fav);
      product.favorites = favs;
    }
    return this.productRepository.save(product);
  }

  async getProductBySkuAndIsFavorite(
    sku: string,
    userId: string,
  ): Promise<ProductDto> {
    const product = await this.productRepository.findOne({
      where: { productSku: sku },
    });
    if (!product) throw new NotFoundException('product not found');
    let isFavorite = false;
    if (product.favorites != null) {
      const favorites: Favorite[] = product.favorites;
      for (const favorite of favorites) {
        if (favorite.userId === userId && favorite.isFavorite) {
          isFavorite = true;
        }
      }
    }
    return this.toProductDto(product, isFavorite);
  }

  async filterFavoritesProduct(userId: string): Promise<ProductDto[]> {
    let products: Product[];
    const productDtos: ProductDto[] = [];
    try {
      const query = `
                SELECT *
                FROM product
                WHERE JSON_CONTAINS(favorites, '[{"userId": "${userId}", "isFavorite": true}]')
            `;
      products = await this.productRepository.query(query);
      for (const product of products) {
        productDtos.push(this.toProductDto(product, false));
      }
      return productDtos;
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async filterProducts(word: string): Promise<ProductDto[]> {
    const results: Product[] = await this.productRepository
      .createQueryBuilder('product')
      .where('product.name LIKE :word', { word: `%${word}%` })
      .orWhere('product.description LIKE :word', { word: `%${word}%` })
      .getMany();
    const productDtos: ProductDto[] = [];
    for (const product of results) {
      productDtos.push(this.toProductDto(product, false));
    }
    return productDtos;
  }

  async getProductsWithLimit(size: number): Promise<Product[]> {
    return this.productRepository.find({
      take: size,
    });
  }

  async getProductBySku(sku: string): Promise<Product> {
    return this.productRepository.findOneBy({
      productSku: sku,
    });
  }

  private toProductDto(product: Product, isBookmarked: boolean): ProductDto {
    return new ProductDto(
      product.id,
      product.name,
      product.description,
      product.weight,
      product.sellingPrice,
      product.locationUniqueId,
      isBookmarked,
      product.imageUrl,
      product.productSku,
    );
  }
}
