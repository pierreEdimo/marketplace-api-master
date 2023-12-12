import { DataSource } from 'typeorm';
import { SubCategory } from './sub.category.entity';

export const subCategoryProviders = [
  {
    provide: 'SUBCATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SubCategory),
    inject: ['DATA_SOURCE'],
  },
];
