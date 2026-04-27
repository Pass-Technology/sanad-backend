import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { ReasonsForChoosing, PeakDemandTime, CustomerRetention, ResponseToPriceIncrease } from '../types/target-audience-profile-sections.types'

export class UpdatePurchasingDto {
    @ApiPropertyOptional({ enum: ['<100', '100-300', '300-700', '>700'] })
    @IsEnum(['<100', '100-300', '300-700', '>700'])
    @IsOptional()
    avg_order_value?: string

    @ApiPropertyOptional({ enum: ReasonsForChoosing })
    @IsEnum(ReasonsForChoosing)
    @IsOptional()
    reason_for_choosing?: ReasonsForChoosing;

    @ApiPropertyOptional({ enum: PeakDemandTime })
    @IsEnum(PeakDemandTime)
    @IsOptional()
    peak_demand_time?: PeakDemandTime;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    is_seasonal?: boolean

    @ApiPropertyOptional({ enum: CustomerRetention })
    @IsEnum(CustomerRetention)
    @IsOptional()
    customer_retention?: CustomerRetention;

    @ApiPropertyOptional({ enum: ResponseToPriceIncrease })
    @IsEnum(ResponseToPriceIncrease)
    @IsOptional()
    response_to_price_increase?: ResponseToPriceIncrease;
}