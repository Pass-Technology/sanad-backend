import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class BankTransferMethodDto {

    @ApiProperty({ example: true, description: 'Accept bank transfer payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Emirates NBD', description: 'Bank Name' })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    bankName: string;

    @ApiProperty({ example: 'Ahmed Al Maktoum', description: 'Account Holder Name' })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    accountHolderName: string;

    @ApiProperty({ example: '1234567890', description: 'Account Number', required: false })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    accountNumber?: string;

    @ApiProperty({ example: 'AE070331234567890123456', description: 'IBAN' })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    iban: string;

    @ApiProperty({ example: 'ABCDEF123', description: 'Swift Code', required: false })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    swiftCode?: string;
}
