import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsUserExisting } from '../validators/existing-user-for-auth.validator';

export class ChangePasswordDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email (required if mobile not provided)',
  })
  @ValidateIf((o: ChangePasswordDto) => !o.mobile)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsEmail()
  @IsUserExisting({ field: 'email' })
  email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'User mobile (required if email not provided)',
  })
  @ValidateIf((o: ChangePasswordDto) => !o.email)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsString()
  @IsUserExisting({ field: 'mobile' })
  mobile?: string;

  @ApiProperty({ example: 'newpassword123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
