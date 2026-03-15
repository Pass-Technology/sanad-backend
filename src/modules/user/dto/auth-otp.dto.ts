import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
    Matches,
} from 'class-validator';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';

export class OtpAuthDto {
    @ApiPropertyOptional({
        example: 'user@example.com or +1234567890',
        description: 'User identifier (email or mobile)',
    })
    @IsNotEmpty({ message: 'Identifier must be provided' })
    @IsEmailOrMobile()
    identifier: string;

    @ApiProperty({ example: '12345', maxLength: 5, minLength: 5 })
    @IsNumber()
    otp: number;
}
