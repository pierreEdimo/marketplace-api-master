import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SubCategory } from './sub.category.entity';
import { Repository } from 'typeorm';
import { CreateSubCategory } from './create.sub-category';

@Injectable()
export class SubCategoryService {
  constructor(
    @Inject('SUBCATEGORY_REPOSITORY')
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async getSingleCategory(id: number): Promise<SubCategory> {
    const category = await this.subCategoryRepository.findOneById(id);
    if (!category) throw new NotFoundException('category was not found');
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.subCategoryRepository.findOneById(id);
    if (!category) throw new NotFoundException('category was not found');
    await this.subCategoryRepository.remove(category);
  }

  async getAllCategories(): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find();
  }

  async getCategoriesByParentCategoryId(
    categoryId: number,
  ): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find({
      where: {
        category: {
          id: categoryId,
        },
      },
    });
  }

  async createCategory(subCategory: CreateSubCategory): Promise<SubCategory> {
    const category: SubCategory =
      this.subCategoryRepository.create(subCategory);
    return await this.subCategoryRepository.save(category);
  }

  async editCategory(
    id: number,
    subCategory: CreateSubCategory,
  ): Promise<void> {
    const category: SubCategory = await this.subCategoryRepository.findOneById(
      id,
    );
    if (!category) throw new NotFoundException('category was not found');
    Object.assign(category, subCategory);
    await this.subCategoryRepository.save(category);
  }
}
