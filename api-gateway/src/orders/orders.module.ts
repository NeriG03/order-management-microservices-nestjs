import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_PACKAGE_NAME } from 'src/types/proto/orders';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: ORDERS_PACKAGE_NAME,
          protoPath: join(__dirname, '../orders.proto'),
          url: 'localhost:50052',
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [],
})
export class OrdersModule {}
