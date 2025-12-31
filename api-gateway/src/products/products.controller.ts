import {
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientGrpc, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  PRODUCT_SERVICE_NAME,
  PRODUCTS_PACKAGE_NAME,
  ProductServiceClient,
} from 'src/types/proto/products';

@Controller('products')
export class ProductsController implements OnModuleInit {
  private productsService: ProductServiceClient;
  constructor(@Inject(PRODUCTS_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.productsService =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Post()
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.getProduct({ productId: +id });
  }

  @Get('by-category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.getProductsByCategory({
      categoryId: +categoryId,
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Payload() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct({
      productId: +id,
      ...updateProductDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct({ productId: +id });
  }
}
