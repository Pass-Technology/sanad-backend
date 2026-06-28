import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
    @ApiProperty({ description: 'Title of the job post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false, description: 'Description of requirements' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false, description: 'Estimated budget' })
    @IsNumber()
    @IsOptional()
    @Min(0)
    budget?: number;
}
