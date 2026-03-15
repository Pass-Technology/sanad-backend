import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateIf,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { OtpPurposeEnum } from '../enum/otp-purpose.enum';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';

export class ValidateOtpDto {
  @ApiPropertyOptional({
    example: 'user@example.com or +1234567890',
    description: 'User identifier (email or mobile)',
  })
  @IsNotEmpty({ message: 'Identifier must be provided' })
  @IsEmailOrMobile()
  identifier: string;

  @ApiProperty({ example: '12345', minLength: 4, maxLength: 5 })
  @IsNumber()
  // @Length(4, 5, { message: 'OTP must be between 4 and 5 characters' })
  // @Matches(/^\d+$/, { message: 'OTP must contain only digits' })
  otp: number;
}
