import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ValidateEmailOrMobile } from '../validators/validate-email-or-mobile.validator';

export class RegisterDto {
  @ValidateEmailOrMobile()
  _emailOrMobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
