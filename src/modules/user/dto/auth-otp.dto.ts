import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';
import { OtpPurposeEnum } from 'src/modules/otp/enum/otp-purpose.enum';

export class OtpAuthDto {
    @ApiProperty({
        example: 'user@example.com or +1234567890',
        description: 'User identifier (email or mobile)',
    })
    @IsNotEmpty({ message: 'Identifier must be provided' })
    @IsEmailOrMobile()
    identifier: string;

    @ApiProperty({ example: '55555', maxLength: 5, minLength: 5 })
    @IsNumber()
    otp: number;

    @ApiProperty({
        enum: OtpPurposeEnum,
        description: 'OTP purpose',
    })
    @IsEnum(OtpPurposeEnum)
    purpose: OtpPurposeEnum;
}
