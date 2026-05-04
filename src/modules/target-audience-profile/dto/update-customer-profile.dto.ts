import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Categories, DominantGender, CustomerAgeRange, DeliveryLocations, IncomeLevel, LeadSources } from '../types/target-audience-profile-sections.types';
import { NationalityStaticCode, CityStaticCode } from '../../lookups/enums/lookup-static-codes.enum';

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

    @ApiPropertyOptional({ enum: NationalityStaticCode, isArray: true })
    @IsArray()
    @IsEnum(NationalityStaticCode, { each: true })
    @IsOptional()
    nationalities?: NationalityStaticCode[];

    @ApiPropertyOptional({ enum: DeliveryLocations })
    @IsEnum(DeliveryLocations)
    @IsOptional()
    delivery_locations?: DeliveryLocations;

    @ApiPropertyOptional({ enum: IncomeLevel })
    @IsEnum(IncomeLevel)
    @IsOptional()
    income_level?: IncomeLevel;

    @ApiPropertyOptional({ enum: CityStaticCode, isArray: true })
    @IsArray()
    @IsEnum(CityStaticCode, { each: true })
    @IsOptional()
    highest_demand_cities?: CityStaticCode[];

    @ApiPropertyOptional({ enum: LeadSources })
    @IsEnum(LeadSources)
    @IsOptional()
    lead_sources?: LeadSources;
}
