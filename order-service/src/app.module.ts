import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailsOrderModule } from './details-order/details-order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5433,
      username: process.env.POSTGRES_USER || 'order_svc_user',
      password: process.env.POSTGRES_PASSWORD || 'order_svc_password',
      database: process.env.POSTGRES_DB || 'order_svc_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrdersModule,
    DetailsOrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
