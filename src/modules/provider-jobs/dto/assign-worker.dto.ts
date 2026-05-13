import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignWorkerDto {
    @ApiProperty({ description: 'ID of the worker to assign to this job' })
    @IsUUID()
    @IsNotEmpty()
    workerId: string;
}
