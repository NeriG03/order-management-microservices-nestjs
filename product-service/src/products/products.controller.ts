import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
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

@Controller()
@ProductServiceControllerMethods()
export class ProductsController implements ProductServiceController {
  constructor(private readonly productsService: ProductsService) {}

  async createProduct(request: CreateProductReq): Promise<ProductRes> {
    const product = await this.productsService.create({
      name: request.name,
      description: request.description,
      price: request.price,
      stock: request.stock,
      categoryId: request.categoryId,
    });
    return {
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category.id,
    };
  }

  async updateProduct(request: UpdateProductReq): Promise<ProductRes> {
    const product = await this.productsService.update(request.productId, {
      name: request.name,
      description: request.description,
      price: request.price,
      stock: request.stock,
      categoryId: request.categoryId,
    });

    return {
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category.id,
    };
  }

  async deleteProduct(request: GetProductIDReq): Promise<DeleteProductRes> {
    const result = await this.productsService.remove(request.productId);
    return {
      success: result.success,
      message: result.message,
    };
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
