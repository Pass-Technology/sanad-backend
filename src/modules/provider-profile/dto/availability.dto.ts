import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class AvailabilitySlot {
    @IsString()
    from: string;

    @IsString()
    to: string;
}

export class Availability {
    @IsString()
    day: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailabilitySlot)
    slots: AvailabilitySlot[];
}

export class AvailabilityDto {
    @ApiProperty({
        type: [Availability],
        required: false,
        example: [
            { day: 'Monday', slots: [{ from: '09:00', to: '12:00' }] },
            { day: 'Tuesday', slots: [{ from: '09:00', to: '12:00' }] },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Availability)
    availability?: Availability[];
}
