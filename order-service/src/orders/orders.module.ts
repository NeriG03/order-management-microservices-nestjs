import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailsOrder } from 'src/details-order/entities/details-order.entity';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, DetailsOrder])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
