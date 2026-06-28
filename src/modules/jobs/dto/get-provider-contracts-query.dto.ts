import { IsOptional, IsEnum, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContractStatus } from '../enums/contract-status.enum';

export class GetProviderContractsQueryDto {
    @ApiPropertyOptional({ enum: ['active', 'completed', 'cancelled'] })
    @IsIn(['active', 'completed', 'cancelled'])
    @IsOptional()
    type?: string;

    @ApiPropertyOptional({ enum: ContractStatus })
    @IsEnum(ContractStatus)
    @IsOptional()
    status?: ContractStatus;
}
