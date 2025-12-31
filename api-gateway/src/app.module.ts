import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [OrdersModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
