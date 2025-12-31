import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTS_PACKAGE_NAME } from 'src/types/proto/products';
import { join } from 'path';
import { CategoriesController } from './categories.controller';
import { CATEGORIES_PACKAGE_NAME } from 'src/types/proto/categories';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: PRODUCTS_PACKAGE_NAME,
          protoPath: join(__dirname, '../products.proto'),
        },
      },
      {
        name: CATEGORIES_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: CATEGORIES_PACKAGE_NAME,
          protoPath: join(__dirname, '../categories.proto'),
        },
      },
    ]),
  ],
  controllers: [ProductsController, CategoriesController],
  providers: [],
})
export class ProductsModule {}
