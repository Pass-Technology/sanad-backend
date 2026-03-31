import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class ChequeMethodDto {
    @ApiProperty({ example: true, description: 'Accept cheque payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Emirates NBD', description: 'Bank Name', required: true })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsNotEmpty()
    bankName: string;

    @ApiProperty({ example: 'Sanad Tech', description: 'Payee Name', required: true })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsNotEmpty()
    payeeName: string;
}
