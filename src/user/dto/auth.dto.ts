import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class AuthDto {
  @ValidateIf((o: AuthDto) => !o.mobile)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsEmail()
  email?: string;

  @ValidateIf((o: AuthDto) => !o.email)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsString()
  mobile?: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
