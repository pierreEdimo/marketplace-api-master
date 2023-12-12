import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CartItem } from './cart.item';
import { UserInformation } from './user.information';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  userInformation: UserInformation;

  @Column({ nullable: false })
  locationUniqueId: string;

  @Column({ default: null })
  deliveryDate: Date;

  @Column({ default: 'Attente' })
  status: string;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: 'Cash' })
  payMentMethode: string;

  @Column()
  createdAt: Date = new Date(Date.now());

  @Column()
  updatedAt: Date = new Date(Date.now());

  @Column({ type: 'json' })
  cartItems: CartItem[];
}
