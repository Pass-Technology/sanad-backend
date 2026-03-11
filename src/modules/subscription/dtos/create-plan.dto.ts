import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsUUID } from 'class-validator';

export class CreatePlanDto {
    @ApiProperty({ example: 'Growth' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'Growth' })
    @IsString()
    name: string;

    @ApiProperty({ example: 49.99 })
    @IsNumber()
    @Min(0)
    monthlyPrice: number;

    @ApiProperty({ example: 100, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    bookingLimit?: number;

    @ApiProperty({ example: 5, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    commissionPercent?: number;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    isMostPopular?: boolean;

}