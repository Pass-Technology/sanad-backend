import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

enum SettlementPreference {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export class SanadMethodDto {
    @ApiProperty({ example: true, description: 'Enable Sanad Payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({
        example: 'weekly',
        enum: SettlementPreference,
        description: 'Settlement Preference (Daily, Weekly, Monthly)',
    })
    @ValidateIf(o => o.isEnabled === true)
    @IsEnum(SettlementPreference)
    settlementPreference: string;

    @ApiProperty({ example: 'uuid-of-bank-account', description: 'Linked Bank Account ID', required: false })
    @IsString()
    @IsOptional()
    linkedBankAccountId?: string;

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

    @ApiProperty({ example: '1234567890', description: 'Account Number', required: true })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsNotEmpty()
    accountNumber: string;

    @ApiProperty({ example: 'AE070331234567890123456', description: 'IBAN' })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsNotEmpty()
    iban: string;
}
