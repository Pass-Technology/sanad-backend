import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Categories, DominantGender, CustomerAgeRange, DeliveryLocations, IncomeLevel, LeadSources } from '../types/target-audience-profile-sections.types';

export class UpdateCustomerProfileDto {
    @ApiPropertyOptional({ enum: Categories })
    @IsEnum(Categories)
    @IsOptional()
    categories?: Categories;

    @ApiPropertyOptional({ enum: DominantGender })
    @IsEnum(DominantGender)
    @IsOptional()
    dominant_gender?: DominantGender;

    @ApiPropertyOptional({ enum: CustomerAgeRange })
    @IsEnum(CustomerAgeRange)
    @IsOptional()
    age_range?: CustomerAgeRange;

    @ApiPropertyOptional({ example: ['Saudi'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    nationalities?: string[];

    @ApiPropertyOptional({ enum: DeliveryLocations })
    @IsEnum(DeliveryLocations)
    @IsOptional()
    delivery_locations?: DeliveryLocations;

    @ApiPropertyOptional({ enum: IncomeLevel })
    @IsEnum(IncomeLevel)
    @IsOptional()
    income_level?: IncomeLevel;

    @ApiPropertyOptional({ example: ['Riyadh'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    highest_demand_cities?: string[];

    @ApiPropertyOptional({ enum: LeadSources })
    @IsEnum(LeadSources)
    @IsOptional()
    lead_sources?: LeadSources;
}
