import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class RequestPayoutDto {
    @ApiProperty({ description: 'Amount to withdraw' })
    @IsNumber()
    @Min(1)
    amount: number;
}
