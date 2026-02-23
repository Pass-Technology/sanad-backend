import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IsUserExisting } from '../../user/validators/existing-user-for-auth.validator';

export class SendOtpDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email (required if mobile not provided)',
  })
  @ValidateIf((o: SendOtpDto) => !o.mobile)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsEmail()
  @IsUserExisting({ field: 'email', message: 'User with this email does not exist' })
  email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'User mobile (required if email not provided)',
  })
  @ValidateIf((o: SendOtpDto) => !o.email)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsString()
  @IsUserExisting({ field: 'mobile', message: 'User with this mobile does not exist' })
  mobile?: string;
}
