import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ORDERS_PACKAGE_NAME } from './types/proto/orders';
import { join } from 'path';
import { Logger } from '@nestjs/common/services/logger.service';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GracefulRpcExceptionFilter } from './common/filters/graceful-rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: ORDERS_PACKAGE_NAME,
      protoPath: [join(__dirname, '../proto/orders.proto')],
      url: 'localhost:50052',
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

  Logger.log('Order microservice is listening...');
}
bootstrap();
