import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class AuthDto {
  @ApiPropertyOptional({ example: 'user@example.com', description: 'User email (required if mobile not provided)' })
  @ValidateIf((o: AuthDto) => !o.mobile)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'User mobile (required if email not provided)' })
  @ValidateIf((o: AuthDto) => !o.email)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsString()
  mobile?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
