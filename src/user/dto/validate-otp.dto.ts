import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
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

  @ApiProperty({ example: '12345', minLength: 4, maxLength: 5 })
  @IsString()
  @Length(4, 5, { message: 'OTP must be between 4 and 5 characters' })
  @Matches(/^\d+$/, { message: 'OTP must contain only digits' })
  @IsValidOtp()
  otp: string;
}
