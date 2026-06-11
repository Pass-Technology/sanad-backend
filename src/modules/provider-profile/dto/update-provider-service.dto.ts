import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Availability } from './availability.dto';
import { Description as DescriptionInterface } from 'src/modules/service-management/interfaces/category-description.interface';

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

    @ApiPropertyOptional({ example: { en: 'English', ar: 'Arabic' } })
    @IsOptional()
    @ValidateNested()
    @Type(() => Description)
    description?: DescriptionInterface;

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

    @ApiPropertyOptional({
        description: 'Min price',
        example: 80,
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    minPrice: number;

    @ApiPropertyOptional({
        description: 'Max price',
        example: 200,
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    maxPrice: number;
}

export class UpdateDetailedServicesDto {
    @ApiProperty({ type: [UpdateProviderServiceDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateProviderServiceDto)
    services: UpdateProviderServiceDto[];
}

class Description {
    @IsString()
    en: string;

    @IsString()
    ar: string;
}
