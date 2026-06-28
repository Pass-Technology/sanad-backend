import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterWorkerDto {
    @ApiProperty({ description: 'The unique invitation token' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}
