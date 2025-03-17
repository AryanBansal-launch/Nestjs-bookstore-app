import { Category } from './../schemas/book.schema';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  readonly author: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
  @IsNotEmpty()
  @IsEnum(Category,{message: 'Invalid category'})
  readonly category: Category;
}