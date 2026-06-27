import { IsNotEmpty, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({ description: 'Rating score from 1 to 5' })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ required: false, description: 'Review comment/feedback' })
    @IsString()
    @IsOptional()
    comment?: string;
}
