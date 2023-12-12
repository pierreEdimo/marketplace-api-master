import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Favorite } from './favorite';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  weight: number;

  @Column()
  sellingPrice: number;

  @Column()
  locationUniqueId: string;

  @Column({ unique: true, nullable: false })
  productSku: string;

  @Column({ nullable: false })
  categoryId: number;

  @Column({ nullable: false })
  subCategoryId: number;

  @Column({ type: 'json' })
  favorites: Favorite[];

  constructor(
    name: string,
    description: string,
    imageUrl: string,
    weight: number,
    sellingPrice: number,
    locationUniqueId: string,
    categoryId: number,
    subCategoryId: number,
    productSku: string,
  ) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.weight = weight;
    this.sellingPrice = sellingPrice;
    this.locationUniqueId = locationUniqueId;
    this.categoryId = categoryId;
    this.subCategoryId = subCategoryId;
    this.productSku = productSku;
  }
}
