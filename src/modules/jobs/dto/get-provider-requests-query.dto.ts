import { IsEnum, IsOptional, IsString, IsNumber, IsUUID, IsDateString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProviderRequestTab } from '../enums/provider-request-tab.enum';

export class GetProviderRequestsQueryDto {
    @ApiPropertyOptional({ enum: ProviderRequestTab, default: ProviderRequestTab.NEW })
    @IsEnum(ProviderRequestTab)
    @IsOptional()
    tab?: ProviderRequestTab;

    @ApiPropertyOptional({ description: 'Search by service title, category, or location' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by category name' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Filter by location' })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiPropertyOptional({ description: 'Minimum budget filter' })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    minBudget?: number;

    @ApiPropertyOptional({ description: 'Maximum budget filter' })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    maxBudget?: number;

    @ApiPropertyOptional({ description: 'Filter contracts/offers by scheduled date (YYYY-MM-DD)' })
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiPropertyOptional({ description: 'Filter by assigned worker profile ID' })
    @IsUUID()
    @IsOptional()
    assigneeId?: string;
}
