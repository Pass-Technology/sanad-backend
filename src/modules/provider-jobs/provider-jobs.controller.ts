import { Controller, Post, Get, Body, Param, UseGuards, Query, Patch, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { VerificationGuard } from '../auth/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ProviderJobsService } from './provider-jobs.service';
import { CreateProviderOfferDto } from './dto/create-provider-offer.dto';

import { OfferStatus } from '../marketplace/enums/offer-status.enum';
import { AssignWorkerDto } from './dto/assign-worker.dto';
import { GetProviderJobsQueryDto } from './dto/get-provider-jobs-query.dto';
import { UpdateJobProgressDto } from './dto/update-job-progress.dto';

@ApiTags('Provider Jobs')
@ApiBearerAuth()
@Controller('provider-jobs')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.PROVIDER)
export class ProviderJobsController {
    constructor(private readonly providerJobsService: ProviderJobsService) { }

    // ═══════════════════════════════════════════════════════
    // AVAILABLE REQUESTS
    // ═══════════════════════════════════════════════════════

    @Get('available-requests')
    @ApiOperation({ summary: 'Get available requests matching provider services' })
    getAvailableRequests(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('serviceId') serviceId?: string,
        @Query('search') search?: string,
    ) {
        return this.providerJobsService.getAvailableRequests(req.user.userId, serviceId, search);
    }

    @Get('available-requests/:id')
    @ApiOperation({ summary: 'Get service request details' })
    getRequestById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.providerJobsService.getRequestById(req.user.userId, id);
    }

    @Post('available-requests/:id/reject')
    @ApiOperation({ summary: 'Dismiss a request from feed' })
    rejectRequest(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.providerJobsService.rejectRequest(req.user.userId, id);
    }

    // ═══════════════════════════════════════════════════════
    // OFFERS
    // ═══════════════════════════════════════════════════════

    @Post('offers')
    @ApiOperation({ summary: 'Make an offer on a service request' })
    createOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: CreateProviderOfferDto,
    ) {
        return this.providerJobsService.createProviderOffer(req.user.userId, dto);
    }

    @Get('offers')
    @ApiOperation({ summary: 'Get my submitted offers' })
    getMyOffers(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('status') status?: OfferStatus,
    ) {
        return this.providerJobsService.getMyOffers(req.user.userId, status);
    }

    @Patch('offers/:id/withdraw')
    @ApiOperation({ summary: 'Withdraw a pending offer' })
    withdrawOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.providerJobsService.withdrawOffer(req.user.userId, id);
    }

    // ═══════════════════════════════════════════════════════
    // JOBS
    // ═══════════════════════════════════════════════════════

    @Get()
    @ApiOperation({ summary: 'Get jobs by type (active, completed, cancelled)' })
    getJobs(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('type') type: string,
        @Query() query: GetProviderJobsQueryDto,
    ) {
        return this.providerJobsService.getProviderJobs(req.user.userId, type, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get job details' })
    getJobById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.providerJobsService.getProviderJobById(req.user.userId, id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update job status (follows state machine)' })
    updateJobStatus(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: UpdateJobProgressDto,
    ) {
        return this.providerJobsService.updateJobStatus(req.user.userId, id, dto);
    }

    @Patch(':id/assign-worker')
    @ApiOperation({ summary: 'Assign a worker to a job' })
    assignWorker(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: AssignWorkerDto,
    ) {
        return this.providerJobsService.assignWorker(req.user.userId, id, dto);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a job' })
    cancelJob(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.providerJobsService.cancelProviderJob(req.user.userId, id);
    }

    // ═══════════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════════

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get provider dashboard stats' })
    getProviderStats(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.providerJobsService.getProviderDashboardStats(req.user.userId);
    }

    @Get('dashboard/workers')
    @ApiOperation({ summary: 'Get list of provider workers' })
    getWorkers(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.providerJobsService.getProviderWorkers(req.user.userId);
    }
}
