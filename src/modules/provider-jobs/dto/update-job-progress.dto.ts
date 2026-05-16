import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { JobStatus } from '../../marketplace/enums/job-status.enum';

export class UpdateJobProgressDto {
    @ApiPropertyOptional({ enum: JobStatus, description: 'New job status — must follow valid state transitions' })
    @IsOptional()
    @IsEnum(JobStatus)
    status?: JobStatus;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    beforeServicePhotos?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    afterServicePhotos?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    customerSignature?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}
