import { IsNotEmpty, IsUUID, IsBoolean, ValidateIf, Equals } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignWorkerDto {
    @ApiPropertyOptional({ description: 'ID of the worker profile to assign' })
    @ValidateIf((o) => o.assignSelf !== true)
    @IsUUID()
    @IsNotEmpty()
    workerId?: string;

    @ApiPropertyOptional({
        description: 'Assign the provider themselves as worker (solo organization)',
        default: false,
    })
    @ValidateIf((o) => !o.workerId)
    @IsBoolean()
    @Equals(true)
    assignSelf?: boolean;
}
