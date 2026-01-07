import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';

import type { OrderServiceClient } from 'src/types/proto/orders';
import { ORDERS_PACKAGE_NAME, ORDER_SERVICE_NAME } from 'src/types/proto/orders';
import * as CreateOrderDtoNamespace from './dto/create-order.dto';

@Controller('orders')
export class OrdersController implements OnModuleInit {
  private ordersService: OrderServiceClient;
  constructor(@Inject(ORDERS_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.ordersService = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDtoNamespace.CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.getOrders({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.getOrder({ orderId: +id });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.deleteOrder({ orderId: +id });
  }
}
