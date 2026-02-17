import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class ValidateOtpDto {
  @ValidateIf((o) => !o.mobile)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsEmail()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Either email or mobile must be provided' })
  @IsString()
  mobile?: string;

  @IsString()
  @Length(4, 8, { message: 'OTP must be between 4 and 8 characters' })
  otp: string;
}
