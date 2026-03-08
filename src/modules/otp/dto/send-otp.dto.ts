import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IsUserExisting } from '../../user/validators/existing-user-for-auth.validator';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';

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
}
