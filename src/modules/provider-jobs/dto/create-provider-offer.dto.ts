import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderOfferDto {
    @ApiProperty({ description: 'ID of the service request to bid on' })
    @IsUUID()
    @IsNotEmpty()
    clientServiceRequestId: string;

    @ApiProperty({ description: 'Offered price in AED' })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;

    @ApiProperty({ required: false, description: 'Notes for the client' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ required: false, description: 'Estimated duration in minutes' })
    @IsInt()
    @IsOptional()
    @Min(1)
    estimatedDurationMinutes?: number;
}
