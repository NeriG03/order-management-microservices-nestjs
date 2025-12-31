import { Module } from '@nestjs/common';
import { DetailsOrderService } from './details-order.service';
import { DetailsOrderController } from './details-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { DetailsOrder } from './entities/details-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, DetailsOrder])],
  controllers: [DetailsOrderController],
  providers: [DetailsOrderService],
})
export class DetailsOrderModule {}
