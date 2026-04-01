import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CashMethodDto {
    @ApiProperty({ example: true, description: 'Enable cash payments' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Exact change required at delivery', required: false })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsOptional()
    @IsString()
    notes?: string;
}
