import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetWorkerAvailabilityQueryDto {
    @ApiProperty({ description: 'Job ID to check availability against its requested schedule' })
    @IsUUID()
    jobId: string;

    @ApiPropertyOptional({ description: 'Override schedule to check (ISO date). Uses offer proposed time when submitting.' })
    @IsDateString()
    @IsOptional()
    scheduledAt?: string;
}
