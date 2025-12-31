import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CreateProductReq,
  DeleteProductRes,
  ProductByCategoryReq,
  ProductListRes,
  GetProductIDReq,
  ProductRes,
  ProductServiceController,
  ProductServiceControllerMethods,
  UpdateProductReq,
} from 'src/types/proto/products';
import { Observable } from 'rxjs';

@Controller()
@ProductServiceControllerMethods()
export class ProductsController implements ProductServiceController {
  constructor(private readonly productsService: ProductsService) {}
  createProduct(
    request: CreateProductReq,
  ): Promise<ProductRes> | Observable<ProductRes> | ProductRes {
    throw new Error('Method not implemented.');
  }
  updateProduct(
    request: UpdateProductReq,
  ): Promise<ProductRes> | Observable<ProductRes> | ProductRes {
    throw new Error('Method not implemented.');
  }
  deleteProduct(
    request: GetProductIDReq,
  ): Promise<DeleteProductRes> | Observable<DeleteProductRes> | DeleteProductRes {
    throw new Error('Method not implemented.');
  }

  async getProduct(request: GetProductIDReq): Promise<ProductRes> {
    const product = await this.productsService.findOne(request.productId);
    return {
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category.id,
    };
  }

  async getProductsByCategory(request: ProductByCategoryReq): Promise<ProductListRes> {
    const products = await this.productsService.findByCategory(request.categoryId);
    return {
      products: products.map(product => ({
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.category.id,
      })),
    };
  }
}
