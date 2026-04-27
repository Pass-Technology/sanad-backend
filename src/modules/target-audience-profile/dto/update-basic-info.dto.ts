import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { Gender, ResidencyStatus, EducationLevel, IncomeLevel } from '../types/target-audience-profile-sections.types'

export class UpdateBasicInfoDto {
    @ApiPropertyOptional({ example: 18 })
    @IsNumber()
    @IsOptional()
    age_from?: number;

    @ApiPropertyOptional({ example: 25 })
    @IsNumber()
    @IsOptional()
    age_to?: number;

    @ApiPropertyOptional({ enum: Gender })
    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @ApiPropertyOptional({ enum: ResidencyStatus })
    @IsEnum(ResidencyStatus)
    @IsOptional()
    residency_status?: ResidencyStatus;

    @ApiPropertyOptional({ enum: EducationLevel })
    @IsEnum(EducationLevel)
    @IsOptional()
    education_level?: EducationLevel;

    @ApiPropertyOptional({ enum: IncomeLevel })
    @IsEnum(IncomeLevel)
    @IsOptional()
    income_level?: IncomeLevel;
}