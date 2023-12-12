import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SubCategory } from '../sub-category/sub.category.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, nullable: false })
  public name: string;

  @Column({ nullable: false })
  public imageUrl: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];
}
