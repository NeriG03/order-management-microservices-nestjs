import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PRODUCTS_PACKAGE_NAME } from './types/proto/products';
import { CATEGORIES_PACKAGE_NAME } from './types/proto/categories';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PRODUCTS_ORDER_PACKAGE_NAME } from './types/proto/products_order';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { GracefulRpcExceptionFilter } from './common/filters/graceful-rpc-exception.filter';

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

  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalFilters(new GracefulRpcExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();

  Logger.log('Product microservice is listening...');
}
bootstrap();
