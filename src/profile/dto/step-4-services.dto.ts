import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateServicesDto {
    @ApiProperty({
        example: ['service-uuid-1', 'service-uuid-2'],
        description: 'Array of selected service IDs',
        type: [String],
    })
    @IsArray()
    @ArrayMinSize(0, { message: 'At least one service must be selected' })
    @IsString({ each: true })
    selectedServiceIds: string[];
}
