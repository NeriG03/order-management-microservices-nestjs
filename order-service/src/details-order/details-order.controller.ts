import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DetailsOrderService } from './details-order.service';
import { CreateDetailsOrderDto } from './dto/create-details-order.dto';
import { UpdateDetailsOrderDto } from './dto/update-details-order.dto';

@Controller()
export class DetailsOrderController {
  constructor(private readonly detailsOrderService: DetailsOrderService) {}
}
