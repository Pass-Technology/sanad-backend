import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsString, IsInt, Min, IsBoolean, IsDateString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOfferDto {
    @ApiProperty({ description: 'ID of the job to bid on' })
    @IsUUID()
    @IsNotEmpty()
    jobId: string;

    @ApiProperty({ description: 'Offered price for the job' })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ description: 'Cover note or details' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional({ description: 'Estimated duration in days' })
    @IsInt()
    @IsOptional()
    @Min(1)
    estimatedDuration?: number;

    @ApiPropertyOptional({ default: true, description: 'Use the customer requested schedule' })
    @IsBoolean()
    @IsOptional()
    usesRequestedSchedule?: boolean;

    @ApiPropertyOptional({ description: 'Required when usesRequestedSchedule is false' })
    @ValidateIf((o) => o.usesRequestedSchedule === false)
    @IsDateString()
    @IsNotEmpty()
    proposedScheduledAt?: string;

    @ApiPropertyOptional({ description: 'Worker profile to assign to this offer' })
    @ValidateIf((o) => !o.assignSelf)
    @IsUUID()
    @IsOptional()
    workerId?: string;

    @ApiPropertyOptional({
        description: 'Assign the provider themselves as worker (solo organization)',
        default: false,
    })
    @ValidateIf((o) => !o.workerId)
    @IsBoolean()
    @IsOptional()
    assignSelf?: boolean;
}
