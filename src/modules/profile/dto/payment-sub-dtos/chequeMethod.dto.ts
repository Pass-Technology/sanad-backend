import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChequeMethodDto {
    @ApiProperty({ example: true, description: 'Accept cheque payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Emirates NBD', description: 'Bank Name', required: false })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    bankName?: string;

    @ApiProperty({ example: 'Sanad Tech', description: 'Payee Name', required: false })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    payeeName?: string;
}
