import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ORDERS_PACKAGE_NAME } from './types/proto/orders';
import { join } from 'path';
import { Logger } from '@nestjs/common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: ORDERS_PACKAGE_NAME,
      protoPath: [join(__dirname, '../proto/orders.proto')],
      url: 'localhost:50052',
    },
  });

  await app.listen();

  Logger.log('Order microservice is listening...');
}
bootstrap();
