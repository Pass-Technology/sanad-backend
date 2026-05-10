import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsUUID, IsBoolean, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../enums/payment-method.enum';

export class CreateOrderDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    serviceId: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    scheduledAt?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    lat?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    lng?: number;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isUrgent?: boolean;

    @ApiProperty({ required: false, enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    totalEstimate?: number;

    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    details?: any;
}
