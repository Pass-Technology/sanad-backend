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

export class AuthDto {
  @ApiProperty({
    example: 'user@example.com or +1234567890',
    description: 'User email or mobile',
  })
  @IsNotEmpty({ message: 'Identifier must be provided' })
  @IsEmailOrMobile()
  @IsUserExisting({ field: 'identifier' })
  identifier: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
