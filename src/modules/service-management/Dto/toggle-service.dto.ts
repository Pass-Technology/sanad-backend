import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleServiceDto {
    @ApiProperty({ description: 'The ID of the provider service to toggle' })
    @IsUUID()
    id: string;
}
