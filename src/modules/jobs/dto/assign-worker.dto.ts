import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignWorkerDto {
    @ApiProperty({ description: 'ID of the worker to assign' })
    @IsUUID()
    @IsNotEmpty()
    workerId: string;
}
