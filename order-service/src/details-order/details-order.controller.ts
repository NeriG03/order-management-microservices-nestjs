import { Controller } from '@nestjs/common';
import { DetailsOrderService } from './details-order.service';

@Controller()
export class DetailsOrderController {
  constructor(private readonly detailsOrderService: DetailsOrderService) {}
}
