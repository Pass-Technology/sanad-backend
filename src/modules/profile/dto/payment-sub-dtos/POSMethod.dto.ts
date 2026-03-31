import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class PosMethodDto {
    @ApiProperty({ example: true, description: 'POS machine available' })
    @IsBoolean()
    isAvailable: boolean;

    @ApiProperty({ example: 'Network International', description: 'Provider Name', required: false })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    providerName?: string;

    @ApiProperty({ example: 'DEV-12345', description: 'Device ID', required: false })
    @IsString()
    @IsOptional()
    deviceId?: string;

    @ApiProperty({ example: ['Visa', 'MasterCard'], description: 'Supported Cards', isArray: true, required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    supportedCards?: string[];
}
