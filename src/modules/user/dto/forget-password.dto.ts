import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsEmailOrMobile } from '../../../shared/validators/email-or-mobile.validator';
import { IsUserExisting } from '../validators/existing-user-for-auth.validator';

export class ForgetPasswordDto {
    @ApiProperty({
        example: 'user@example.com or +1234567890',
        description: 'User identifier (email or mobile)',
    })
    @IsNotEmpty({ message: 'Identifier must be provided' })
    @IsEmailOrMobile()
    @IsUserExisting({ field: 'identifier' })
    identifier: string;
}
