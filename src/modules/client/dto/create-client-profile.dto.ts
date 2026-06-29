import {
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsEnum,
    IsArray,
    ValidateNested,
    Min,
    Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../enums/payment-method.enum';

export class CreateClientAddressDto {
    @ApiProperty({ description: 'Label for the address', example: 'home' })
    @IsString()
    label: string;

    @ApiProperty({ description: 'Full address string', example: '123 Main St, Dubai' })
    @IsString()
    address: string;

    @ApiPropertyOptional({ description: 'Latitude coordinate', example: 25.2048493 })
    @IsNumber()
    @IsOptional()
    @Min(-90)
    @Max(90)
    lat?: number;

    @ApiPropertyOptional({ description: 'Longitude coordinate', example: 55.2707828 })
    @IsNumber()
    @IsOptional()
    @Min(-180)
    @Max(180)
    lng?: number;

    @ApiPropertyOptional({ description: 'Set as default address', default: false })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}

export class CreateClientPaymentMethodDto {
    @ApiProperty({ description: 'Payment method type', enum: PaymentMethod, example: PaymentMethod.CARD })
    @IsEnum(PaymentMethod)
    type: PaymentMethod;

    @ApiPropertyOptional({ description: 'Payment provider', example: 'Visa' })
    @IsString()
    @IsOptional()
    provider?: string;

    @ApiPropertyOptional({ description: 'Last four digits of card', example: '4242' })
    @IsString()
    @IsOptional()
    lastFour?: string;

    @ApiPropertyOptional({ description: 'Set as default payment method', default: false })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;

    @ApiPropertyOptional({ description: 'Additional metadata for the payment method' })
    @IsOptional()
    metadata?: any;
}

export class CreateClientProfileDto {
    @ApiPropertyOptional({ description: 'Client display name', example: 'John Doe' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'List of client addresses', type: [CreateClientAddressDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateClientAddressDto)
    @IsOptional()
    addresses?: CreateClientAddressDto[];

    @ApiPropertyOptional({ description: 'List of payment methods', type: [CreateClientPaymentMethodDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateClientPaymentMethodDto)
    @IsOptional()
    paymentMethods?: CreateClientPaymentMethodDto[];
}
