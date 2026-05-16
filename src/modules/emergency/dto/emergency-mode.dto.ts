import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsUUID } from 'class-validator';

export class UpdateEmergencyServicesDto {
    @ApiProperty({ type: [String], description: 'List of provider service IDs to enable for emergency mode' })
    @IsArray()
    @IsUUID('all', { each: true })
    serviceIds: string[];
}

export class ToggleEmergencyModeDto {
    @ApiProperty({ description: 'New emergency mode status' })
    @IsBoolean()
    isActive: boolean;
}
