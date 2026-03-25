import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Length, Matches } from 'class-validator';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';
import { IsUserExisting } from '../validators/existing-user-for-auth.validator';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'user@example.com or +1234567890',
        description: 'User identifier (email or mobile)',
    })
    @IsNotEmpty({ message: 'Identifier must be provided' })
    @IsEmailOrMobile()
    @IsUserExisting({ field: 'identifier' })
    identifier: string;

    @ApiProperty({ example: 'newpassword123', minLength: 6 })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}
