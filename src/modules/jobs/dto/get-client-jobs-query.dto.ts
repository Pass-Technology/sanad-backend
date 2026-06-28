import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobStatus } from '../enums/job-status.enum';

export class GetClientJobsQueryDto {
    @ApiPropertyOptional({ enum: JobStatus })
    @IsEnum(JobStatus)
    @IsOptional()
    status?: JobStatus;
}
