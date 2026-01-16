import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailsOrder } from 'src/details-order/entities/details-order.entity';
import { Order } from './entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTS_ORDER_PACKAGE_NAME } from 'src/types/proto/products_order';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, DetailsOrder]),
    ClientsModule.register([
      {
        name: PRODUCTS_ORDER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: PRODUCTS_ORDER_PACKAGE_NAME,
          protoPath: join(process.cwd(), 'proto/products_order.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
