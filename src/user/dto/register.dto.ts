import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsUserNotExisting } from '../validators/existing-user.validator';

export class RegisterDto {
  @ValidateIf((o) => !o.mobile)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsEmail()
  @IsUserNotExisting({ field: 'email' })
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsString()
  @IsUserNotExisting({ field: 'mobile' })
  mobile?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
