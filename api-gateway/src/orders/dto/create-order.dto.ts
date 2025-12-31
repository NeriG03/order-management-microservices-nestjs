import { IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetailsOrderDto } from './create-details-order.dto';

export class CreateOrderDto {
  @IsArray({ message: 'The details must be an array' })
  @ArrayMinSize(1, { message: 'There must be at least one detail in the order' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetailsOrderDto)
  details: CreateDetailsOrderDto[];
}
