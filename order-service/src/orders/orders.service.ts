import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderListRes } from 'src/types/proto/orders';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      this.logger.log(`Creating order with ${createOrderDto.details.length} items`);

      // Crear la orden
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

      this.logger.log(`Order created successfully with ID: ${savedOrder.id}`);
      return savedOrder;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack);
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
      this.logger.warn(`Order with ID: ${id} not found`);
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      this.logger.warn(`Order with ID: ${id} not found for deletion`);
      throw new NotFoundException('Order not found');
    }
    await this.orderRepository.delete(id);
    this.logger.log(`Order with ID: ${id} deleted successfully`);
    return { success: true, message: `Order with ID ${id} deleted successfully` };
  }
}
