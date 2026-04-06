import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsArray, ValidateIf } from 'class-validator';

export class PosMethodDto {
    @ApiProperty({ example: true, description: 'POS machine available' })
    @IsBoolean()
    isEnabled: boolean;

    @ApiProperty({ example: '22e0a1a1-2222-4444-8888-000000000001', description: 'Provider Name UUID' })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsNotEmpty()
    providerName: string;

    @ApiProperty({ example: 'DEV-12345', description: 'Device ID', required: false })
    @ValidateIf(o => o.isEnabled === true)
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsString()
    @IsOptional()
    deviceId?: string;

    // when @IsString() is enabled it gives an error "payment.pos.0.each value in supportedCards must be a string"
    // check later
    @ApiProperty({ example: ['33e0a1a1-4444-4444-8888-000000000001', '33e0a1a1-4444-4444-8888-000000000002'], description: 'Supported Cards UUIDs', isArray: true })
    @ValidateIf(o => o.isEnabled === true)
    // @IsOptional()
    @Transform(({ value, obj }) => (obj.isEnabled ? value : undefined))
    @IsArray()
    // @IsString({ each: true })
    @IsNotEmpty({ each: true })
    supportedCards: string[];
}
