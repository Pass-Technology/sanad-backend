import { Controller, Get, Body, Param, UseGuards, Query, Patch, Post, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ProviderJobsService } from './provider-jobs.service';
import { AssignWorkerDto } from './dto/assign-worker.dto';
import { GetProviderContractsQueryDto } from './dto/get-provider-contracts-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AddContractAssetsDto } from './dto/add-contract-assets.dto';
import { ContractEntity } from './entities/contract.entity';

@ApiTags('Provider Contracts')
@ApiBearerAuth()
@Controller('provider/contracts')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.PROVIDER)
export class ProviderContractsController {
    constructor(private readonly providerJobsService: ProviderJobsService) {}

    @Get()
    @ApiOperation({ summary: 'Get contracts by type (active, completed, cancelled)' })
    getContracts(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('type') type: string,
        @Query() query: GetProviderContractsQueryDto,
    ): Promise<ContractEntity[]> {
        return this.providerJobsService.getContracts(req.user.userId, type, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get contract details' })
    getContractById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.providerJobsService.getContractById(req.user.userId, id);
    }

    @Patch(':id/assign-worker')
    @ApiOperation({ summary: 'Assign a worker profile to a contract' })
    assignWorker(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: AssignWorkerDto,
    ): Promise<ContractEntity> {
        return this.providerJobsService.assignWorker(req.user.userId, id, dto);
    }

    @Patch(':id/start')
    @ApiOperation({ summary: 'Start contract work' })
    startContract(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.providerJobsService.startContract(req.user.userId, id);
    }

    @Patch(':id/complete')
    @ApiOperation({ summary: 'Mark contract finished and review client' })
    completeContract(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: CreateReviewDto,
    ): Promise<ContractEntity> {
        return this.providerJobsService.completeContract(req.user.userId, id, dto);
    }

    @Post(':id/assets')
    @ApiOperation({ summary: 'Upload service documentation images for a contract' })
    addContractAssets(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: AddContractAssetsDto,
    ): Promise<ContractEntity> {
        return this.providerJobsService.addContractAssets(req.user.userId, id, dto);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a contract' })
    cancelContract(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.providerJobsService.cancelContract(req.user.userId, id);
    }
}
