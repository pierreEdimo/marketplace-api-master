import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.subCategories)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
