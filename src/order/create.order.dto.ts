import { CartItem } from './cart.item';

export class CreateOrderDto {
  userId: string;
  locationUniqueId: string;
  cartItems: CartItem[];
}
