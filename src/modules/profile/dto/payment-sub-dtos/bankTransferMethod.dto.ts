import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class BankTransferMethodDto {

    @ApiProperty({ example: true, description: 'Accept bank transfer payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Emirates NBD', description: 'Bank Name' })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsNotEmpty()
    bankName: string;

    @ApiProperty({ example: 'Ahmed Al Maktoum', description: 'Account Holder Name' })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsNotEmpty()
    accountHolderName: string;

    @ApiProperty({ example: '1234567890', description: 'Account Number', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    accountNumber?: string;

    @ApiProperty({ example: 'AE070331234567890123456', description: 'IBAN' })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsNotEmpty()
    iban: string;

    @ApiProperty({ example: 'ABCDEF123', description: 'Swift Code', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    swiftCode?: string;
}