import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;
}
