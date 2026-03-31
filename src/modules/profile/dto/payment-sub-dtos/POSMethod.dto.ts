import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsArray, ValidateIf } from 'class-validator';

export class PosMethodDto {
    @ApiProperty({ example: true, description: 'POS machine available' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: 'Network International', description: 'Provider Name' })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsNotEmpty()
    providerName: string;

    @ApiProperty({ example: 'DEV-12345', description: 'Device ID', required: false })
    @ValidateIf(o => o.isEnabled === true)
    @IsString()
    @IsOptional()
    deviceId?: string;

    @ApiProperty({ example: ['Visa', 'MasterCard'], description: 'Supported Cards', isArray: true })
    @ValidateIf(o => o.isEnabled === true)
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    supportedCards: string[];
}
