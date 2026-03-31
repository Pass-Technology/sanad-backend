import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BankTransferMethodDto {
    @ApiProperty({ example: 'Emirates NBD', description: 'Bank Name' })
    @IsString()
    @IsNotEmpty()
    bankName: string;

    @ApiProperty({ example: 'Ahmed Al Maktoum', description: 'Account Holder Name' })
    @IsString()
    @IsNotEmpty()
    accountHolderName: string;

    @ApiProperty({ example: '1234567890', description: 'Account Number (optional)', required: false })
    @IsString()
    @IsOptional()
    accountNumber?: string;

    @ApiProperty({ example: 'AE070331234567890123456', description: 'IBAN' })
    @IsString()
    @IsNotEmpty()
    iban: string;
}