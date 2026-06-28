import { Controller, Get, Body, Param, UseGuards, Query, Patch, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ClientJobsService } from './client-jobs.service';
import { GetClientContractsQueryDto } from './dto/get-client-contracts-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContractEntity } from './entities/contract.entity';

@ApiTags('Client Contracts')
@ApiBearerAuth()
@Controller('client/contracts')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.CLIENT)
export class ClientContractsController {
    constructor(private readonly clientJobsService: ClientJobsService) {}

    @Get()
    @ApiOperation({ summary: 'Get my contracts by type (active, completed, cancelled)' })
    getMyContracts(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('type') type: string,
        @Query() query: GetClientContractsQueryDto,
    ): Promise<ContractEntity[]> {
        return this.clientJobsService.getContracts(req.user.userId, type, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get contract details' })
    getContractById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.clientJobsService.getContractById(req.user.userId, id);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a contract' })
    cancelContract(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.clientJobsService.cancelContract(req.user.userId, id);
    }

    @Patch(':id/confirm')
    @ApiOperation({ summary: 'Confirm contract completion and review provider' })
    confirmContract(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: CreateReviewDto,
    ): Promise<ContractEntity> {
        return this.clientJobsService.confirmContractCompletion(req.user.userId, id, dto);
    }

    @Patch(':id/start')
    @ApiOperation({ summary: 'Record client acknowledgment that service has started' })
    acknowledgeStart(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.clientJobsService.acknowledgeStart(req.user.userId, id);
    }
}
