import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CashMethodDto {
    @ApiProperty({ example: true, description: 'Enable cash payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Exact change required at delivery', required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}
