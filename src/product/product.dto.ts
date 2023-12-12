export class ProductDto {
  id: number;

  name: string;

  description: string;

  weight: number;

  sellingPrice: number;

  locationUniqueId: string;

  bookMarked: boolean;

  imageUrl: string;

  productSku: string;

  constructor(
    id: number,
    name: string,
    description: string,
    weight: number,
    sellingPrice: number,
    locationUniqueId: string,
    bookMarked: boolean,
    imageUrl: string,
    productSku: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.weight = weight;
    this.sellingPrice = sellingPrice;
    this.locationUniqueId = locationUniqueId;
    this.bookMarked = bookMarked;
    this.imageUrl = imageUrl;
    this.productSku = productSku;
  }
}
