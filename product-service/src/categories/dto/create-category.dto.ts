import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'The name must be a string' })
  @MinLength(1, { message: 'The name must not be empty' })
  name: string;
}
