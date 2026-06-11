import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProviderServiceStatus } from '../enums/provider-services-status.enums';

export class GetProviderCategoryServicesQueryDto {
    @ApiPropertyOptional({ description: 'Filter services by name matching the active language' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed !== '' ? trimmed : null;
        }
        return null;
    })
    name?: string | null;

    @ApiPropertyOptional({
        enum: ProviderServiceStatus,
        description: 'Filter services by their current status. Possible values: ',
        example: ProviderServiceStatus.PENDING,
    })
    @IsOptional()
    @IsEnum(ProviderServiceStatus)
    status?: ProviderServiceStatus;

    @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Page number' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10, description: 'Items per page' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
}
