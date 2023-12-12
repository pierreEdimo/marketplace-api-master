import { UserInformation } from './user.information';
import { CartItem } from './cart.item';

export class UnregisteredOrder {
  userInformation: UserInformation;
  locationUniqueId: string;
  cartItems: CartItem[];
}
