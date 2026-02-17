import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ValidateEmailOrMobile } from '../validators/validate-email-or-mobile.validator';

export class AuthDto {
  @ValidateEmailOrMobile()
  _emailOrMobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
