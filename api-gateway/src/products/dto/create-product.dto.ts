import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price should not be empty' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @IsNumber({}, { message: 'Stock must be a number' })
  @IsNotEmpty({ message: 'Stock should not be empty' })
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @IsNumber({}, { message: 'Category ID must be a number' })
  @IsNotEmpty({ message: 'Category ID should not be empty' })
  categoryId: number;
}
