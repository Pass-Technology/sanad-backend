import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { WorkingHours, WorkStructure } from '../types/target-audience-profile-sections.types';

export class UpdateOperationsDto {
    @ApiPropertyOptional({ example: 10 })
    @IsNumber()
    @IsOptional()
    daily_capacity?: number;

    @ApiPropertyOptional({ enum: WorkingHours })
    @IsEnum(WorkingHours)
    @IsOptional()
    working_hours?: WorkingHours;

    @ApiPropertyOptional({ enum: WorkStructure })
    @IsEnum(WorkStructure)
    @IsOptional()
    work_structure?: WorkStructure;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    has_transportation?: boolean;
}
