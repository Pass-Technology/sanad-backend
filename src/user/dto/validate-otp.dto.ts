import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ValidateEmailOrMobile } from '../validators/validate-email-or-mobile.validator';

export class ValidateOtpDto {
  @ValidateEmailOrMobile()
  _emailOrMobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsString()
  @Length(4, 8, { message: 'OTP must be between 4 and 8 characters' })
  otp: string;
}
