import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsUserNotExisting } from '../validators/existing-user.validator';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';
import { UserIdentifierType } from '../enums/user-identifier-type.enum';

export class UserRegisterDto {
  @ApiProperty({
    example: 'user@example.com or +1234567890',
    description: 'User email or mobile',
  })
  @IsNotEmpty({ message: 'Identifier must be provided' })
  @IsEmailOrMobile()
  @IsUserNotExisting({ field: 'identifier' })
  identifier: string;

  // decide if the identifier is email or mobile
  get identifierType(): UserIdentifierType {
    return this.identifier.includes('@') ? UserIdentifierType.EMAIL : UserIdentifierType.MOBILE;
  }

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
