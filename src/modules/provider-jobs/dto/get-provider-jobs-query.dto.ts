import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobStatus } from '../../marketplace/enums/job-status.enum';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class GetProviderJobsQueryDto extends PaginationQueryDto {
    @ApiProperty({ required: false, description: 'Filter by service category' })
    @IsOptional()
    @IsUUID()
    serviceId?: string;

    @ApiProperty({ required: false, enum: JobStatus })
    @IsOptional()
    @IsEnum(JobStatus)
    status?: JobStatus;

    @ApiProperty({ required: false, description: 'Search by client name or address' })
    @IsOptional()
    @IsString()
    search?: string;
}
