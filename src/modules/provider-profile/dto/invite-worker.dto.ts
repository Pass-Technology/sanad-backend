import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteWorkerDto {
    @ApiProperty({ description: 'Email address or Phone number of the invited worker' })
    @IsString()
    @IsNotEmpty()
    emailOrPhone: string;

    @ApiProperty({ description: 'Full name of the worker' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
