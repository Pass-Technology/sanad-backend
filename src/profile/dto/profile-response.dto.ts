import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileStatus } from '../enums/profile-status.enum';

export class StepResponseDto {
    @ApiProperty({ example: 'step-1' })
    message: string;

    @ApiProperty({ example: 2 })
    currentStep: number;

    @ApiProperty({ example: "Draft" })
    statusId: string;

    @ApiPropertyOptional({ description: 'Saved data for this step' })
    data?: unknown;
}

export class ProgressResponseDto {
    @ApiProperty({ example: 3 })
    currentStep: number;

    @ApiProperty({ example: "Draft" })
    statusId: string;

    @ApiPropertyOptional({ description: 'All saved data so far' })
    data?: unknown;
}
