import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class UpdatePlanDto {

    @ApiPropertyOptional({ example: 'Growth' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 49.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    monthlyPrice?: number;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    bookingLimit?: number;

    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    commissionPercent?: number;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isMostPopular?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

}