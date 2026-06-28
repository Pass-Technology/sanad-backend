import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContractStatus } from '../enums/contract-status.enum';

export class GetClientContractsQueryDto {
    @ApiPropertyOptional({ enum: ContractStatus })
    @IsEnum(ContractStatus)
    @IsOptional()
    status?: ContractStatus;
}
