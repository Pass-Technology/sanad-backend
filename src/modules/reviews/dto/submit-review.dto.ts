import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsArray, Min, Max, IsUUID } from 'class-validator';

export class SubmitReviewDto {
    @ApiProperty({ description: 'The job ID to review' })
    @IsUUID()
    jobId: string;

    @ApiProperty({ description: 'Rating from 1 to 5' })
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ required: false, description: 'Review comment' })
    @IsString()
    @IsOptional()
    comment?: string;

    @ApiProperty({ required: false, description: 'Quick feedback tags', type: [String] })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ required: false, description: 'Photos of the completed work', type: [String] })
    @IsArray()
    @IsOptional()
    photos?: string[];
}
