import { Controller, Get, Patch, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { JobsService } from './jobs.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContractStatus } from './enums/contract-status.enum';
import { ContractEntity } from './entities/contract.entity';

@ApiTags('Worker Contracts')
@ApiBearerAuth()
@Controller('worker/contracts')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.WORKER)
export class WorkerContractsController {
    constructor(private readonly jobsService: JobsService) {}

    @Get()
    @ApiOperation({ summary: 'Get assigned contracts by type (active, completed, cancelled)' })
    getMyContracts(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('type') type: string,
    ): Promise<ContractEntity[]> {
        return this.jobsService.getWorkerContracts(req.user.userId, this.resolveStatuses(type));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get assigned contract details' })
    getContractById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.jobsService.getContractById(id, req.user.userId);
    }

    @Patch(':id/start')
    @ApiOperation({ summary: 'Start assigned contract work' })
    startContract(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.jobsService.startContract(req.user.userId, id);
    }

    @Patch(':id/complete')
    @ApiOperation({ summary: 'Mark assigned contract finished and review client' })
    completeContract(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: CreateReviewDto,
    ): Promise<ContractEntity> {
        return this.jobsService.completeContractByProvider(req.user.userId, id, dto);
    }

    private resolveStatuses(type: string): ContractStatus[] {
        switch (type) {
            case 'active':
                return [ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.PROVIDER_COMPLETED];
            case 'completed':
                return [ContractStatus.COMPLETED];
            case 'cancelled':
                return [ContractStatus.CANCELLED];
            default:
                return [ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.PROVIDER_COMPLETED, ContractStatus.COMPLETED, ContractStatus.CANCELLED];
        }
    }
}
