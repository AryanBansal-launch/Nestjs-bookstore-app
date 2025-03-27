import { User } from '../../auth/schemas/user.schema';
import { Category } from './../schemas/book.schema';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
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
  @IsEnum(Category, { message: 'Invalid category' })
  readonly category: Category;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
