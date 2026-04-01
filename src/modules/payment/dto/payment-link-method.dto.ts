import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, IsEmail, ValidateIf } from 'class-validator';

export class PaymentLinkMethodDto {
    @ApiProperty({ example: true, description: 'Enable payment link' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Stripe', description: 'Payment provider name (e.g., Stripe, PayTabs)' })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    providerName: string;

    // needs refactor when its ready
    @ApiProperty({ example: 'merchant@example.com', description: 'Account email or Merchant ID' })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    accountEmailOrMerchantId: string;

    @ApiProperty({ example: 'sk_test_...', description: 'API Key', required: false })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsOptional()
    apiKey?: string;

    @ApiProperty({ example: 'https://example.com/callback', description: 'Callback / Webhook URL', required: false })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsUrl()
    @IsOptional()
    callbackUrl?: string;
}
