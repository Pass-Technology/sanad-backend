import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class CreateUserInfoDto {
    @ApiProperty({ example: 'Ahmed Al Maktoum' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: 'ahmed@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({
        example: '+971501234567',
        description: 'Full international number including country code (E.164)',
    })
    @IsOptional()
    @Matches(/^\+[1-9]\d{6,14}$/, {
        message: 'mobileNumber must be in E.164 format (e.g. +971501234567)',
    })
    mobileNumber?: string;

    @ApiProperty({
        example: '784-1234-1234567-1',
        description: 'Emirates ID: 784-XXXX-XXXXXXX-X',
    })
    @IsNotEmpty()
    @Matches(/^784-\d{4}-\d{7}-\d{1}$/, {
        message: 'nationalId must follow the format 784-XXXX-XXXXXXX-X',
    })
    nationalId: string;

    @ApiPropertyOptional({ example: '1990-05-15' })
    @IsOptional()
    @IsString()
    dateOfBirth?: string;
}
