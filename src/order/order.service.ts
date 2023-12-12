import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { UserInformation } from './user.information';
import { UnregisteredOrder } from './unregistered.order';
import { CreateOrderDto } from './create.order.dto';
import { CartItem } from './cart.item';
import { SellReport } from './sell.report';
import { OrderDto } from './order.dto';
import { EmailNotificationService } from 'src/notification/email.notification.service';

@Injectable()
export class OrderService {
  today = moment().startOf('day');
  endOfDay = moment(this.today).endOf('day').toDate();

  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<Order>,
    private emailNotification: EmailNotificationService,
  ) { }

  async getAllOrders(): Promise<OrderDto[]> {
    const mappedOrders: OrderDto[] = [];
    const orders: Order[] = await this.orderRepository.find();
    orders.forEach((order) => mappedOrders.push(this.toOrderDto(order)));
    return mappedOrders;
  }

  async getSingleOrder(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOneById(id);
    if (!order) throw new NotFoundException('Order was not found');
    return this.toOrderDto(order);
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findOneById(id);
    if (!order) throw new NotFoundException('Order was not found');
    await this.orderRepository.remove(order);
  }

  async getUserCartItemList(userId: string): Promise<OrderDto[]> {
    const mappedOrders: OrderDto[] = [];
    const orders: Order[] = await this.orderRepository
      .createQueryBuilder('order')
      .where('JSON_EXTRACT(userInformation, "$.id") = :userId', {
        userId: userId,
      })
      .andWhere('order.confirmed = :status', { status: false })
      .getMany();
    orders.forEach((order) => mappedOrders.push(this.toOrderDto(order)));
    return mappedOrders;
  }

  async getUserConfirmedOrders(userId: string): Promise<OrderDto[]> {
    const mappedOrders: OrderDto[] = [];
    const orders: Order[] = await this.orderRepository
      .createQueryBuilder('order')
      .where('JSON_EXTRACT(userInformation, "$.id") = :userId', {
        userId: userId,
      })
      .andWhere('order.confirmed = :status', { status: true })
      .getMany();
    orders.forEach((order) => mappedOrders.push(this.toOrderDto(order)));
    return mappedOrders;
  }

  async getTodaysOrdersByLocaionId(luid: string): Promise<OrderDto[]> {
    const mappedOrders: OrderDto[] = [];
    const orders: Order[] = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.locationUniqueId = :luid', { luid: luid })
      .andWhere('order.confirmed = :status', { status: true })
      .andWhere('order.updated >= :startDate', { startDate: this.today })
      .andWhere('order.updated <= :endDate', { endDate: this.endOfDay })
      .getMany();
    orders.forEach((order) => mappedOrders.push(this.toOrderDto(order)));
    return mappedOrders;
  }

  async getConfirmedByLocationIdAndLimit(
    luid: string,
    size: number,
  ): Promise<OrderDto[]> {
    const mappedOrders: OrderDto[] = [];
    const orders: Order[] = await this.orderRepository.find({
      where: {
        confirmed: true,
        locationUniqueId: luid,
      },
      take: size,
    });
    orders.forEach((order) => mappedOrders.push(this.toOrderDto(order)));
    return mappedOrders;
  }

  async getConfirmedOrdersByLocationIdAndStatus(
    luid: string,
    status: string,
  ): Promise<OrderDto[]> {
    const mappedOrders: OrderDto[] = [];
    const orders: Order[] = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.confirmed = :orderStatus', { orderStatus: true })
      .andWhere('order.locationUniqueId = :luid', { luid: luid })
      .andWhere('order.status = :status', { status: status })
      .getMany();
    orders.forEach((order) => mappedOrders.push(this.toOrderDto(order)));
    return mappedOrders;
  }

  async getTotalOrderCountFromLocationId(luid: string): Promise<any> {
    const value: number = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.locationUniqueId = :luid', { luid: luid })
      .getCount();
    return { value };
  }

  async getTodaysOrderCountByLocationId(luid: string): Promise<any> {
    const value: number = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.locationUniqueId = :luid', { luid: luid })
      .andWhere('order.confirmed = :status', { status: true })
      .andWhere('order.updated >= :startDate', { startDate: this.today })
      .andWhere('order.updated <= :endDate', { endDate: this.endOfDay })
      .getCount();
    return { value };
  }

  async getOrderCountByStatusAndLocationId(
    luid: string,
    status: string,
  ): Promise<any> {
    const value = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.confirmed = :orderStatus', { orderStatus: true })
      .andWhere('order.locationUniqueId = :luid', { luid: luid })
      .andWhere('order.status = :status', { status: status })
      .getCount();
    return { value };
  }

  async getTodayOrderCountByLocationIdAndStatus(
    luid: string,
    status: string,
  ): Promise<any> {
    const value = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.locationUniqueId = :luid', { luid: luid })
      .andWhere('order.confirmed = :orderStatus', { orderStatus: true })
      .andWhere('order.status : :status', { status: status })
      .andWhere('order.updated >= :startDate', { startDate: this.today })
      .andWhere('order.updated <= :endDate', { endDate: this.endOfDay })
      .getCount();
    return { value };
  }

  async getTopOrders(luid: string): Promise<SellReport[]> {
    const result: SellReport[] = await this.orderRepository
      .createQueryBuilder('order')
      .select('cartItems.productSku', 'productSku')
      .addSelect('COUNT(*)', 'total')
      .innerJoin('order.cartItems', 'cartItems')
      .where('order.confirmed = :confirmed', { confirmed: true })
      .andWhere('order.status = :status', { status: 'Delivre' })
      .andWhere('order.locationUniqueId = :luid', { luid: luid })
      .groupBy('cartItems.productSku')
      .getRawMany();

    return result;
  }

  async getConfirmedOrdersByLocationId(luid: string): Promise<OrderDto[]> {
    const mappedOrders: OrderDto[] = [];
    const orders: Order[] = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.locationUniqueId = :luid', { luid: luid })
      .andWhere('order.confirmed = :status', { status: true })
      .getMany();
    orders.forEach((order) => mappedOrders.push(this.toOrderDto(order)));
    return mappedOrders;
  }

  async confirmOrder(userInformation: UserInformation): Promise<void> {
    try {
      const orders = await this.orderRepository
        .createQueryBuilder('order')
        .where('JSON_EXTRACT(userInformation, "$.id") = :userId', {
          userId: userInformation.id,
        })
        .andWhere('confirmed = :confirmed', { confirmed: false })
        .getMany();

      orders.forEach((order) => {
        order.confirmed = true;
        order.userInformation = userInformation;
        this.orderRepository.save(order);
        const totalPrice: number = this.calculateTotalPrice(order.cartItems);
        const totalQuantity: number = this.calculateTotalQuantity(order.cartItems);
        this.emailNotification.sendLocationEmailOnConfirmOrder(order.locationUniqueId,order.cartItems,order.userInformation,totalQuantity,totalPrice,order.payMentMethode);
        this.emailNotification.sendUserEmailConfirmOrder(order.locationUniqueId, order.cartItems, order.userInformation, totalQuantity, totalPrice, order.payMentMethode); 
      });

    } catch (e) {
      console.log(e);
      throw new HttpException(
        "Sorry, we couldn't update your orders. Please try again later.",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateDeliveryDate(id: number, deliveryDate: Date): Promise<void> {
    try {
      await this.orderRepository.update(id, {
        deliveryDate: deliveryDate,
      });
    } catch (error) {
      throw new HttpException(
        "Sorry, we couldn't find the Order",
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateStatusOfOrder(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOneById(id);
    switch (order.status) {
      case 'Attente':
        order.status = 'Traitement';
        break;
      case 'Traitement':
        order.status = 'Route';
        break;
      case 'Route':
        order.status = 'Delivre';
        break;
      case 'Delivre':
        throw new HttpException(
          "Sorry, you can't change the status of a delivered order.",
          HttpStatus.BAD_REQUEST,
        );
    }
    const savedOrder: Order = await this.orderRepository.save(order);
    return this.toOrderDto(savedOrder);
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findOneById(id);
    switch (order.status) {
      case 'Attente':
      case 'Traitement':
        order.status = 'Annule';
        break;
      case 'Route':
        throw new HttpException(
          "Sorry, you can't cancel an order that is already en route.",
          HttpStatus.BAD_REQUEST,
        );
    }
    await this.orderRepository.save(order);
  }

  async increaseItemQuantity(id: number, productSku: string): Promise<void> {
    const foundOrder = await this.orderRepository.findOneById(id);
    if (!foundOrder) throw new NotFoundException('Order not found');
    const cartItem = foundOrder.cartItems.find(
      (item) => item.productSku === productSku,
    );
    if (!cartItem) throw new NotFoundException('Item not found in order');
    const initialPrice = cartItem.initialPrice;
    cartItem.quantity += 1;
    cartItem.price += initialPrice;
    await this.orderRepository.save(foundOrder);
  }

  async decreaseItemQuantity(id: number, productSku: string): Promise<void> {
    const foundOrder = await this.orderRepository.findOneById(id);
    if (!foundOrder) throw new NotFoundException('Order not found');
    const cartItem = foundOrder.cartItems.find(
      (item) => item.productSku === productSku,
    );
    if (!cartItem) throw new NotFoundException('Item not found in order');
    const initialPrice = cartItem.initialPrice;
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.price -= initialPrice;
    } else {
      // Remove the item from the cart if its quantity becomes zero
      const index = foundOrder.cartItems.indexOf(cartItem);
      foundOrder.cartItems.splice(index, 1);
    }
    await this.orderRepository.save(foundOrder);
  }

  async removeItemFromOrder(id: number, productSku: string): Promise<void> {
    const foundOrder = await this.orderRepository.findOneById(id);
    if (!foundOrder) throw new NotFoundException('Order not found');
    const itemIndex = foundOrder.cartItems.findIndex(
      (item) => item.productSku === productSku,
    );
    if (itemIndex === -1)
      throw new NotFoundException('Item not found in order');
    foundOrder.cartItems.splice(itemIndex, 1);
    await this.orderRepository.save(foundOrder);
    if (foundOrder.cartItems.length < 1) {
      await this.orderRepository.delete(id);
    }
  }

  async confirmOrderFromUnregisteredUser(
    unregistedOrder: UnregisteredOrder,
  ): Promise<void> {
    const order = this.orderRepository.create(unregistedOrder);
    order.confirmed = true;
    const totalPrice: number = this.calculateTotalPrice(order.cartItems);
    const totalQuantity: number = this.calculateTotalQuantity(order.cartItems);
    this.emailNotification.sendLocationEmailOnConfirmOrder(order.locationUniqueId,order.cartItems,order.userInformation,totalQuantity,totalPrice,order.payMentMethode);
        this.emailNotification.sendUserEmailConfirmOrder(order.locationUniqueId, order.cartItems, order.userInformation, totalQuantity, totalPrice, order.payMentMethode); 
    await this.orderRepository.save(order);
  }

  async addProductsToCarts(orderDto: CreateOrderDto): Promise<void> {
    const existingOrder = await this.orderRepository
      .createQueryBuilder('order')
      .where('JSON_EXTRACT(userInformation, "$.id") = :userId', {
        userId: orderDto.userId,
      })
      .andWhere('order.locationUniqueId = :luid', {
        luid: orderDto.locationUniqueId,
      })
      .andWhere('order.confirmed = :status', { status: false })
      .getOne();
    if (!existingOrder) {
      const createdOrder = this.toOrder(orderDto);
      createdOrder.confirmed = false;
      await this.orderRepository.save(createdOrder);
    } else {
      const carts: CartItem[] = existingOrder.cartItems.filter(
        (cartItem) => cartItem.productSku === orderDto.cartItems[0].productSku,
      );
      if (carts.length < 1) {
        existingOrder.cartItems.push(orderDto.cartItems[0]);
      } else {
        for (const item of existingOrder.cartItems) {
          if (item.productSku === orderDto.cartItems[0].productSku) {
            item.quantity += orderDto.cartItems[0].quantity;
            item.price += orderDto.cartItems[0].price;
          }
        }
      }
      await this.orderRepository.save(existingOrder);
    }
  }

  private toOrder(orderDto: CreateOrderDto): Order {
    const order: Order = new Order();
    order.cartItems = orderDto.cartItems;
    order.locationUniqueId = orderDto.locationUniqueId;
    order.userInformation = { id: orderDto.userId } as UserInformation;
    return order;
  }

  private toOrderDto(order: Order): OrderDto {
    return {
      id: order.id,
      userInformation: order.userInformation,
      locationUniqueId: order.locationUniqueId,
      deliveryDate: order.deliveryDate,
      status: order.status,
      confirmed: order.confirmed,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      cartItems: order.cartItems,
      totalPrice: this.calculateTotalPrice(order.cartItems),
      totalQuantity: this.calculateTotalQuantity(order.cartItems),
      payMentMethode: order.payMentMethode,
    } as OrderDto;
  }

  private calculateTotalPrice(cartItems: CartItem[]): number {
    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice += item.price;
    }
    return totalPrice;
  }

  private calculateTotalQuantity(cartItems: CartItem[]): number {
    let totalQuantity = 0;
    for (const item of cartItems) {
      totalQuantity += item.quantity;
    }
    return totalQuantity;
  }
}
