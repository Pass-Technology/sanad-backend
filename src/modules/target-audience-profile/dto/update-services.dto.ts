import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateServicesDto {
    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    home_service?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    product_delivery?: boolean;
}
