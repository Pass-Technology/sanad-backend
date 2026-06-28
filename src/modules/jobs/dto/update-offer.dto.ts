import { IsNumber, IsOptional, IsString, IsInt, Min, IsBoolean, IsDateString, IsUUID, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOfferDto {
    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Min(0)
    price?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    @Min(1)
    estimatedDuration?: number;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    usesRequestedSchedule?: boolean;

    @ApiPropertyOptional()
    @ValidateIf((o) => o.usesRequestedSchedule === false)
    @IsDateString()
    @IsOptional()
    proposedScheduledAt?: string;

    @ApiPropertyOptional()
    @ValidateIf((o) => !o.assignSelf)
    @IsUUID()
    @IsOptional()
    workerId?: string | null;

    @ApiPropertyOptional({ description: 'Assign the provider themselves as worker (solo organization)' })
    @ValidateIf((o) => o.workerId === undefined || o.workerId === null)
    @IsBoolean()
    @IsOptional()
    assignSelf?: boolean;
}
