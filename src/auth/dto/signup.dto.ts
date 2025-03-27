import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../enums/role.enum';
export class signupDTO {
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
  @IsOptional()
  role:Role[];
}