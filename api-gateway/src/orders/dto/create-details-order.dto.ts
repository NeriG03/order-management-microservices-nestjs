import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateDetailsOrderDto {
  @IsInt()
  @IsPositive({ message: 'The productId must be a positive number' })
  productId: number;

  @IsInt()
  @Min(1, { message: 'The quantity must be at least 1' })
  quantity: number;

  @IsInt()
  @IsPositive({ message: 'The unitPrice must be a positive number' })
  unitPrice: number;
}
