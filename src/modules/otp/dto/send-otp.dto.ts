import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IsUserExisting } from '../../user/validators/existing-user-for-auth.validator';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';
import { OtpPurposeEnum } from '../enum/otp-purpose.enum';

export class SendOtpDto {
  @ApiPropertyOptional({
    example: 'user@example.com or +1234567890',
    description: 'User identifier (email or mobile)',
  })
  @IsNotEmpty({ message: 'Identifier must be provided' })
  @IsEmailOrMobile()
  @IsUserExisting({
    field: 'identifier',
    message: 'User with this identifier does not exist',
  })
  identifier: string;

  @ApiPropertyOptional({
    example: OtpPurposeEnum.FORGOT_PASSWORD,
    enum: OtpPurposeEnum,
    description: 'OTP purpose',
  })
  @IsNotEmpty({ message: 'Purpose must be provided' })
  @IsEnum(OtpPurposeEnum)
  purpose: OtpPurposeEnum;
}