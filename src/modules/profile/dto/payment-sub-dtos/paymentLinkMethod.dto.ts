import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, IsEmail } from 'class-validator';

export class PaymentLinkMethodDto {
    @ApiProperty({ example: true, description: 'Enable payment link' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Stripe', description: 'Payment provider name (e.g., Stripe, PayTabs)' })
    @IsString()
    @IsNotEmpty()
    providerName: string;

    @ApiProperty({ example: 'merchant@example.com', description: 'Account email or Merchant ID' })
    @IsString()
    @IsNotEmpty()
    accountEmailOrMerchantId: string;

    @ApiProperty({ example: 'sk_test_...', description: 'API Key (Optional)', required: false })
    @IsString()
    @IsOptional()
    apiKey?: string;

    @ApiProperty({ example: 'https://example.com/callback', description: 'Callback / Webhook URL', required: false })
    @IsUrl()
    @IsOptional()
    callbackUrl?: string;
}
