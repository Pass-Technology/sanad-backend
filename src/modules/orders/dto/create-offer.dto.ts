import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    workerId?: string;
}
