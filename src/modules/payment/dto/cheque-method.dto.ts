import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class ChequeMethodDto {
    @ApiProperty({ example: true, description: 'Accept cheque payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Emirates NBD', description: 'Bank Name', required: true })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    bankName: string;

    @ApiProperty({ example: 'Sanad Tech', description: 'Payee Name', required: true })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    payeeName: string;
}
