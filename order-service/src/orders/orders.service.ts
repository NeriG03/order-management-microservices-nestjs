import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import * as products_order from 'src/types/proto/products_order';
import * as microservices from '@nestjs/microservices';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(products_order.PRODUCTS_ORDER_PACKAGE_NAME) private client: microservices.ClientGrpc,
    private productsServiceClient: products_order.ProductsOrderServiceClient,
  ) {}

  onModuleInit() {
    this.productsServiceClient = this.client.getService<products_order.ProductsOrderServiceClient>(
      products_order.PRODUCTS_ORDER_SERVICE_NAME,
    );
  }

  /* TODO: 
    Implementar conexion con gRPC de Product Service, y que se mande un evento a RabbitMQ para que lo pueda
    procesar Payment Service cuando se cree una orden
  */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const available = await this.productsServiceClient.checkProductAvailability({
        productId: createOrderDto.details[0].productId,
        quantity: createOrderDto.details[0].quantity,
      });

      if (!available) {
        throw new Error('Product not available');
      }

      const order = this.orderRepository.create({
        totalAmount: 0,
        details: createOrderDto.details.map(detail => {
          const subtotal = detail.unitPrice * detail.quantity;
          return {
            productId: detail.productId,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            subtotal: subtotal,
          };
        }),
      });

      // Calcular el monto total
      order.totalAmount = order.details.reduce((sum, detail) => sum + detail.subtotal, 0);

      // Guardar la orden con sus detalles (cascade: true)
      const savedOrder = await this.orderRepository.save(order);

      return savedOrder;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['details'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['details'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepository.delete(id);
    return { success: true, message: `Order with ID ${id} deleted successfully` };
  }
}
