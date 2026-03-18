import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { IsUserExisting } from '../../user/validators/existing-user-for-auth.validator';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';

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
  @MinLength(6, { message: 'Password should be at least 6 characters' })
  password: string;
}
