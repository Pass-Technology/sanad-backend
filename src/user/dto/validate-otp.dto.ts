import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { IsValidOtp } from '../validators/valid-otp.validator';

export class ValidateOtpDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email (required if mobile not provided)',
  })
  @ValidateIf((o: ValidateOtpDto) => !o.mobile)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'User mobile (required if email not provided)',
  })
  @ValidateIf((o: ValidateOtpDto) => !o.email)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsString()
  mobile?: string;

  @ApiProperty({ example: '123456', minLength: 4, maxLength: 8 })
  @IsString()
  @Length(4, 8, { message: 'OTP must be between 4 and 8 characters' })
  @IsValidOtp()
  otp: string;
}
