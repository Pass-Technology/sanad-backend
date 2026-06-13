import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProviderServiceStatus } from '../enums/provider-services-status.enums';
import { RequestServiceStatus } from '../enums/request-service-status.enum';

const CombinedStatusValues = [...Object.values(ProviderServiceStatus), ...Object.values(RequestServiceStatus)];
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
        enum: CombinedStatusValues,
        description: 'Filter services by their current status (Provider or Request statuses allowed).',
        example: ProviderServiceStatus.PENDING,
    })
    @IsOptional()
    @IsIn(CombinedStatusValues, {
        message: `status must be one of the following values: ${CombinedStatusValues.join(', ')}`,
    })
    status?: ProviderServiceStatus | RequestServiceStatus;
}
