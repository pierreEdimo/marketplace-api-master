import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UserInformation } from './user.information';
import { UnregisteredOrder } from './unregistered.order';
import { ApiTags } from '@nestjs/swagger';
import { DelivaryDate } from './delivary.date';
import { CreateOrderDto } from './create.order.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Post('/carts')
  async addProducts(@Body() orderDto: CreateOrderDto) {
    return this.orderService.addProductsToCarts(orderDto);
  }

  @Get('/count/today/locations/:luid')
  async getTodayOrderCount(@Param('luid') luid: string) {
    return this.orderService.getTodaysOrderCountByLocationId(luid);
  }

  @Get('/count/today/locations/:luid/status/:status')
  async getTodayOrderCountByLocationIdAndStatus(
    @Param('luid') luid: string,
    @Param('status') status: string,
  ) {
    return this.orderService.getTodayOrderCountByLocationIdAndStatus(
      luid,
      status,
    );
  }

  @Get('/carts/users/:id')
  async getCartList(@Param('id') userId: string) {
    return this.orderService.getUserCartItemList(userId);
  }

  @Get(':id')
  async getSingleOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getSingleOrder(id);
  }

  @Get('/count/locations/:luid/status/:status')
  async getOrdersCountByLocationIdAndStatus(
    @Param('luid') luid: string,
    @Param('status') status: string,
  ) {
    return this.orderService.getOrderCountByStatusAndLocationId(luid, status);
  }

  @Get('/count/locations/:luid')
  async getTotalOrderCount(@Param('luid') luid: string) {
    return this.orderService.getTotalOrderCountFromLocationId(luid);
  }

  @Get('/top/:luid')
  async getTopOrders(@Param('luid') luid: string) {
    return this.orderService.getTopOrders(luid);
  }

  @Put('/order')
  @HttpCode(204)
  async confirmOrder(@Body() userInfo: UserInformation) {
    return this.orderService.confirmOrder(userInfo);
  }

  @Get('/confirmed/users/:id')
  async getUserOrders(@Param('id') userId: string) {
    return this.orderService.getUserConfirmedOrders(userId);
  }

  @Get('/confirmed/locations/:luid/status/:status')
  async getConfirmedOrdersByLocationIdAndStatus(
    @Param('luid') luid: string,
    @Param('status') status: string,
  ) {
    return this.orderService.getConfirmedOrdersByLocationIdAndStatus(
      luid,
      status,
    );
  }

  @Get('/confirmed/locations/:luid')
  async getConfirmedOrdersByLocationId(@Param('luid') luid: string) {
    return this.orderService.getConfirmedOrdersByLocationId(luid);
  }

  @Get('/confirmed/locations/:luid/limit/:size')
  async getOrdersByLocationId(
    @Param('luid') luid: string,
    @Param('size', ParseIntPipe) size: number,
  ) {
    return this.orderService.getConfirmedByLocationIdAndLimit(luid, size);
  }

  @Get('/confirmed/today/locations/:luid')
  async getTodaysOrderByLocationId(@Param('luid') luid: string) {
    return this.orderService.getTodaysOrdersByLocaionId(luid);
  }

  @Put('/status/:id')
  async updateStatusOfOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.updateStatusOfOrder(id);
  }

  @Put('/cancel/:id')
  async cancelOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.cancelOrder(id);
  }

  @Put('/cartItems/increase/:id/sku/:sku')
  async increaseItemQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Param('sku') productSku: string,
  ) {
    return this.orderService.increaseItemQuantity(id, productSku);
  }

  @Put('/cartItems/decrease/:id/sku/:sku')
  async decreaseItemQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Param('sku') productSku: string,
  ) {
    return this.orderService.decreaseItemQuantity(id, productSku);
  }

  @Post('/unregistered')
  async confirmUnregisteredsUsersOrders(@Body() order: UnregisteredOrder) {
    return this.orderService.confirmOrderFromUnregisteredUser(order);
  }

  @Delete('/cartItems/:id/sku/:sku')
  @HttpCode(204)
  async removeItemFromOrder(
    @Param('id') id: number,
    @Param('sku') productSku: string,
  ) {
    return this.orderService.removeItemFromOrder(id, productSku);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }

  @Put('/deliveryDate/:id')
  async updateDelivaryDate(
    @Body() deliveryDate: DelivaryDate,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.orderService.updateDeliveryDate(id, deliveryDate.deliveryDate);
  }
}
