import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class AddFeatureDto {

    @ApiProperty({ example: 'Priority Support' })
    @IsString()
    featureText: string;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    displayOrder?: number;

}