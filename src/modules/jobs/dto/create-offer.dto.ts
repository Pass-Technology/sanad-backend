import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
    @ApiProperty({ description: 'Offered price for the job' })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;

    @ApiProperty({ required: false, description: 'Cover note or details' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ required: false, description: 'Estimated duration in days' })
    @IsInt()
    @IsOptional()
    @Min(1)
    estimatedDuration?: number;
}
