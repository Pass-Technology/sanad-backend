import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsUUID, IsBoolean, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../../marketplace/enums/payment-method.enum';

export class CreateServiceRequestDto {
    @ApiProperty({ description: 'ID of the service from the catalog' })
    @IsUUID()
    @IsNotEmpty()
    serviceId: string;

    @ApiProperty({ required: false, description: 'Description of what the client needs' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false, description: 'When the client wants the service' })
    @IsDateString()
    @IsOptional()
    scheduledAt?: string;

    @ApiProperty({ required: false, description: 'ID of a saved client address' })
    @IsUUID()
    @IsOptional()
    addressId?: string;

    @ApiProperty({ required: false, default: false })
    @IsBoolean()
    @IsOptional()
    isUrgent?: boolean;

    @ApiProperty({ required: false, enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @ApiProperty({ required: false, description: 'Client budget estimate — informational only, not binding' })
    @IsNumber()
    @IsOptional()
    budgetEstimate?: number;

    @ApiProperty({ required: false, description: 'Service-specific details (rooms, property type, etc.)' })
    @IsObject()
    @IsOptional()
    details?: Record<string, any>;
}
