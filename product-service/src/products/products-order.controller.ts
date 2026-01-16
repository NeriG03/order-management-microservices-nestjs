import { Controller } from '@nestjs/common';
import {
  OrderCompletedResponse,
  ProductAvailabilityResponse,
  ProductOrderRequest,
  ProductsOrderServiceController,
  ProductsOrderServiceControllerMethods,
} from 'src/types/proto/products_order';
import { ProductsService } from './products.service';

@Controller('products-order')
@ProductsOrderServiceControllerMethods()
export class ProductsOrderController implements ProductsOrderServiceController {
  constructor(private readonly productsService: ProductsService) {}

  async checkProductAvailability(
    request: ProductOrderRequest,
  ): Promise<ProductAvailabilityResponse> {
    const available = await this.productsService.checkProductsAvailability(request);
    return { available };
  }
  async orderCompleted(request: ProductOrderRequest): Promise<OrderCompletedResponse> {
    await this.productsService.orderCompleted(request);
    return {};
  }
}
