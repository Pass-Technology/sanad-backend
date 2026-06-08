import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Availability } from './availability.dto';

export class UpdateProviderServicePricingDto {
    @ApiPropertyOptional({ example: 'f490f1ee-6c54-4b01-90e6-d701748f0851' })
    @IsOptional()
    @IsUUID()
    id?: string;

    @ApiProperty({ example: 'Standard Cleaning' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 30.0 })
    @IsNumber()
    @IsOptional()
    price?: number;
}

export class UpdateProviderServiceDto {
    @ApiProperty({ example: '222e8400-e29b-41d4-a716-446655440001', description: 'The Global Service ID' })
    @IsUUID()
    serviceId: string;

    @ApiPropertyOptional({ example: 'Custom description for this service' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        type: [Availability],
        required: false,
        example: [
            { day: 'Monday', slots: [{ from: '09:00', to: '12:00' }] },
            { day: 'Tuesday', slots: [{ from: '09:00', to: '12:00' }] },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Availability)
    availability?: Availability[];

    @ApiProperty({ type: [UpdateProviderServicePricingDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateProviderServicePricingDto)
    pricingDetails: UpdateProviderServicePricingDto[];
}

export class UpdateDetailedServicesDto {
    @ApiProperty({ type: [UpdateProviderServiceDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateProviderServiceDto)
    services: UpdateProviderServiceDto[];
}
