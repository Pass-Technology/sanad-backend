import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsUserExisting } from '../validators/existing-user-for-auth.validator';
import { IsEmailOrMobile } from '../../shared/validators/email-or-mobile.validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'user@example.com or +1234567890',
    description: 'User identifier (email or mobile)',
  })
  @IsNotEmpty({ message: 'Identifier must be provided' })
  @IsEmailOrMobile()
  @IsUserExisting({ field: 'identifier' })
  identifier: string;

  @ApiProperty({ example: 'currentpassword123', description: 'Current password' })
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  oldPassword: string;

  @ApiProperty({ example: 'newpassword123', minLength: 6, description: 'New password' })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  password: string;
}
