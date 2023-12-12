import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository, Like } from 'typeorm';
import { CreateCategoryDto } from './create.category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getCategoriesWithLimit(limit: number): Promise<Category[]> {
    return this.categoryRepository.find({
      take: limit,
    });
  }

  async searchCategories(word: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        name: Like(`%${word}%`),
      },
    });
  }

  async getSingleCategory(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneById(id);
    if (!category)
      throw new NotFoundException('Category with id:' + id + ' was not found');
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const category: Category = await this.categoryRepository.findOneById(id);
    if (!category)
      throw new NotFoundException('Category with id:' + id + ' was not found');
    this.categoryRepository.remove(category);
  }

  async createCategory(categoryDto: CreateCategoryDto): Promise<Category> {
    const category: Category = this.categoryRepository.create(categoryDto);
    return this.categoryRepository.save(category);
  }

  async editCategory(
    id: number,
    categoryDto: CreateCategoryDto,
  ): Promise<void> {
    const category: Category = await this.categoryRepository.findOneById(id);
    if (!category)
      throw new NotFoundException('Category with id:' + id + ' was not found');
    Object.assign(category, categoryDto);
    this.categoryRepository.save(category);
  }

  async getRandomCategories(size: number): Promise<Category[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('RAND()')
      .take(size)
      .getMany();
  }
}
