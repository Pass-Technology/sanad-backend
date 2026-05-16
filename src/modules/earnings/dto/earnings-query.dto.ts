import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum TimePeriod {
    TODAY = 'today',
    WEEK = 'week',
    MONTH = 'month',
    CUSTOM = 'custom'
}

export class EarningsQueryDto {
    @ApiPropertyOptional({ enum: TimePeriod, default: TimePeriod.WEEK })
    @IsOptional()
    @IsEnum(TimePeriod)
    period?: TimePeriod;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    endDate?: string;
}
