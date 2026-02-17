import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsUserNotExisting } from '../validators/existing-user.validator';

export class RegisterDto {
  @ApiPropertyOptional({ example: 'user@example.com', description: 'User email (required if mobile not provided)' })
  @ValidateIf((o: RegisterDto) => !o.mobile)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsEmail()
  @IsUserNotExisting({ field: 'email' })
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'User mobile (required if email not provided)' })
  @ValidateIf((o: RegisterDto) => !o.email)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsString()
  @IsUserNotExisting({ field: 'mobile' })
  mobile?: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
