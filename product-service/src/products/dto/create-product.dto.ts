import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'The name must be a string' })
  @MinLength(1, { message: 'The name must not be empty' })
  name: string;

  @IsString({ message: 'The description must be a string' })
  @MinLength(1, { message: 'The description must not be empty' })
  description: string;

  @IsNumber({}, { message: 'The price must be a number' })
  @Min(0, { message: 'The price must be at least 0' })
  price: number;

  @IsNumber({}, { message: 'The stock must be a number' })
  @Min(0, { message: 'The stock must be at least 0' })
  stock: number;

  @IsNumber({}, { message: 'The categoryId must be a number' })
  categoryId: number;
}
