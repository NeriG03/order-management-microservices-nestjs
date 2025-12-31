import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailsOrderDto } from './create-details-order.dto';

export class UpdateDetailsOrderDto extends PartialType(CreateDetailsOrderDto) {
  id: number;
}
