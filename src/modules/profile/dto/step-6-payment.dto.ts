import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsArray,
    IsIn,
    IsNotEmpty,
    IsString,
} from 'class-validator';

const PAYMENT_METHODS = [
    'cash',
    'bank-transfer',
    'payment-link',
    'through-sanad',
    'card-machine',
    'deposit-cheques',
] as const;

export class CreatePaymentDto {
    @ApiProperty({ example: 'Emirates NBD' })
    @IsString()
    @IsNotEmpty()
    bankName: string;

    @ApiProperty({ example: 'Ahmed Al Maktoum' })
    @IsString()
    @IsNotEmpty()
    accountHolderName: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    @IsNotEmpty()
    accountNumber: string;

    @ApiProperty({ example: 'AE070331234567890123456' })
    @IsString()
    @IsNotEmpty()
    iban: string;

    @ApiProperty({
        example: ['cash', 'bank-transfer'],
        enum: PAYMENT_METHODS,
        isArray: true,
        description: 'Accepted payment methods',
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one payment method is required' })
    @IsIn(PAYMENT_METHODS, { each: true, message: 'Each payment method must be one of: cash, bank-transfer, payment-link, through-sanad, card-machine, deposit-cheques' })
    paymentMethodIds: string[];
}
