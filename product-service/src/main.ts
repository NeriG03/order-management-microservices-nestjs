import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PRODUCTS_PACKAGE_NAME } from './types/proto/products';
import { CATEGORIES_PACKAGE_NAME } from './types/proto/categories';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { PRODUCTS_ORDER_PACKAGE_NAME } from './types/proto/products_order';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: [PRODUCTS_PACKAGE_NAME, CATEGORIES_PACKAGE_NAME, PRODUCTS_ORDER_PACKAGE_NAME],
      protoPath: [
        join(__dirname, '../proto/products.proto'),
        join(__dirname, '../proto/categories.proto'),
        join(__dirname, '../proto/products_order.proto'),
      ],
      url: 'localhost:50051',
    },
  });

  await app.listen();

  Logger.log('Product microservice is listening...');
}
bootstrap();
