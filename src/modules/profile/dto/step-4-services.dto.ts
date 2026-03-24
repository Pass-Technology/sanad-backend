import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, IsUUID } from 'class-validator';

export class CreateServicesDto {
    @ApiProperty({
        example: ['222e8400-e29b-41d4-a716-446655440001', '222e8400-e29b-41d4-a716-446655440002'],
        description: 'Array of selected service UUIDs',
        type: [String],
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one service must be selected' })
    @IsUUID('all', { each: true })
    selectedServiceIds: string[];
}
