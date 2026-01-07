import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  CreateOrderListReq,
  DeleteOrderRes,
  GetOrderIDReq,
  GetOrdersReq,
  OrderListRes,
  OrderRes,
  OrderServiceController,
  OrderServiceControllerMethods,
} from 'src/types/proto/orders';
import { Observable } from 'rxjs';

@Controller()
@OrderServiceControllerMethods()
export class OrdersController implements OrderServiceController {
  constructor(private readonly ordersService: OrdersService) {}

  async createOrder(request: CreateOrderListReq): Promise<OrderRes> {
    // Mapear de proto a DTO
    const createOrderDto: CreateOrderDto = {
      details: request.details.map(detail => ({
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
      })),
    };

    const orderCreated = await this.ordersService.create(createOrderDto);

    // Mapear la respuesta de la entidad al proto
    return {
      orderId: orderCreated.id,
      details: orderCreated.details.map(detail => ({
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        subTotal: detail.subtotal,
      })),
      totalAmount: orderCreated.totalAmount,
      createdAt: orderCreated.createdAt.toISOString(),
    };
  }

  getOrder(request: GetOrderIDReq): Promise<OrderRes> | Observable<OrderRes> | OrderRes {
    return this.ordersService.findOne(request.orderId).then(order => ({
      orderId: order.id,
      details: order.details.map(detail => ({
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        subTotal: detail.subtotal,
      })),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
    }));
  }

  getOrders(request: GetOrdersReq): Promise<OrderListRes> {
    return this.ordersService.findAll().then(orders => ({
      orders: orders.map(order => ({
        orderId: order.id,
        details: order.details.map(detail => ({
          productId: detail.productId,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          subTotal: detail.subtotal,
        })),
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString(),
      })),
    }));
  }

  deleteOrder(
    request: GetOrderIDReq,
  ): Promise<DeleteOrderRes> | Observable<DeleteOrderRes> | DeleteOrderRes {
    return this.ordersService.remove(request.orderId);
  }
}
