import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsBoolean, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
    @ApiProperty({ description: 'Title of the job post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ description: 'Description of requirements' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Estimated budget' })
    @IsNumber()
    @IsOptional()
    @Min(0)
    budget?: number;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    isUrgent?: boolean;

    @ApiPropertyOptional({ example: 'Car Services' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ example: 'Dubai Marina' })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiPropertyOptional({ description: 'Full service address for maps' })
    @IsString()
    @IsOptional()
    serviceAddress?: string;

    @ApiPropertyOptional({ description: 'Client preferred date and time' })
    @IsDateString()
    @IsOptional()
    requestedScheduledAt?: string;

    @ApiPropertyOptional({ description: 'Saved client address ID' })
    @IsUUID()
    @IsOptional()
    clientAddressId?: string;
}
