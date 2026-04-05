import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

enum SettlementPreference {
    // DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export class SanadMethodDto {
    @ApiProperty({ example: true, description: 'Enable Sanad Payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: false, description: 'Use existing bank transfer account' })
    @IsBoolean()
    @IsOptional()
    isUsingBankTransferData?: boolean;

    @ApiProperty({
        example: 'weekly',
        enum: SettlementPreference,
        description: 'Settlement Preference (Weekly, Monthly)',
    })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsEnum(SettlementPreference)
    settlementPreference: string;

    @ApiProperty({ example: 'Emirates NBD', description: 'Bank Name' })
    @ValidateIf(o => o.isEnabled === true && o.isUsingBankTransferData !== true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    bankName?: string;

    @ApiProperty({ example: 'Ahmed Al Maktoum', description: 'Account Holder Name' })
    @ValidateIf(o => o.isEnabled === true && o.isUsingBankTransferData !== true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    accountHolderName?: string;

    @ApiProperty({ example: '1234567890', description: 'Account Number', required: true })
    @ValidateIf(o => o.isEnabled === true && o.isUsingBankTransferData !== true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    accountNumber?: string;

    @ApiProperty({ example: 'AE070331234567890123456', description: 'IBAN' })
    @ValidateIf(o => o.isEnabled === true && o.isUsingBankTransferData !== true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    iban?: string;

    @ApiProperty({ example: 'ABCDEF123', description: 'Swift Code', required: false })
    @ValidateIf(o => o.isEnabled === true && o.isUsingBankTransferData !== true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsOptional()
    swiftCode?: string;
}
