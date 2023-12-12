export class CreateProductDto {
  name: string;

  description: string;

  imageUrl: string;

  weight: number;

  sellingPrice: number;

  locationUniqueId: string;

  categoryId: number;

  subCategoryId: number;

  productSku: string;
}
