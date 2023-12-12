import { UserInformation } from './user.information';
import { CartItem } from './cart.item';

export interface OrderDto {
  id: number;
  userInformation: UserInformation;
  locationUniqueId: string;
  deliveryDate?: Date;
  status: string;
  confirmed: boolean;
  payMentMethode: string;
  createdAt: Date;
  updatedAt: Date;
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}
