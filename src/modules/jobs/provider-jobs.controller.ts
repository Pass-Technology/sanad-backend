import { Controller, Post, Get, Body, Param, UseGuards, Query, Patch, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ProviderJobsService } from './provider-jobs.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { GetProviderRequestsQueryDto } from './dto/get-provider-requests-query.dto';
import { GetWorkerAvailabilityQueryDto } from './dto/get-worker-availability-query.dto';
import { OfferStatus } from './enums/offer-status.enum';
import { JobEntity } from './entities/job.entity';
import { OfferEntity } from './entities/offer.entity';

@ApiTags('Provider Jobs')
@ApiBearerAuth()
@Controller('provider/jobs')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.PROVIDER)
export class ProviderJobsController {
    constructor(private readonly providerJobsService: ProviderJobsService) {}

    @Get('requests')
    @ApiOperation({ summary: 'Get provider requests by tab with optional filters' })
    getRequests(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query() query: GetProviderRequestsQueryDto,
    ) {
        return this.providerJobsService.getRequests(req.user.userId, query);
    }

    @Get('open')
    @ApiOperation({ summary: 'Get open job posts available to this provider' })
    getOpenJobs(@Request() req: { user: UserInfoResponseWithTokensDto }): Promise<JobEntity[]> {
        return this.providerJobsService.getOpenJobs(req.user.userId);
    }

    @Get('open/:id')
    @ApiOperation({ summary: 'Get open job post details' })
    getOpenJobById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<JobEntity> {
        return this.providerJobsService.getOpenJobById(req.user.userId, id);
    }

    @Post('open/:id/dismiss')
    @ApiOperation({ summary: 'Dismiss a job post from your feed' })
    dismissJob(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        return this.providerJobsService.dismissJob(req.user.userId, id);
    }

    @Post('offers')
    @ApiOperation({ summary: 'Submit an offer on a job post' })
    submitOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: CreateOfferDto,
    ): Promise<OfferEntity> {
        return this.providerJobsService.submitOffer(req.user.userId, dto);
    }

    @Get('offers')
    @ApiOperation({ summary: 'Get my submitted offers' })
    getMyOffers(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('status') status?: OfferStatus,
    ): Promise<OfferEntity[]> {
        return this.providerJobsService.getMyOffers(req.user.userId, status);
    }

    @Get('offers/:id')
    @ApiOperation({ summary: 'Get offer details for review/edit' })
    getOfferById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<OfferEntity> {
        return this.providerJobsService.getOfferById(req.user.userId, id);
    }

    @Patch('offers/:id')
    @ApiOperation({ summary: 'Update a pending offer' })
    updateOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: UpdateOfferDto,
    ): Promise<OfferEntity> {
        return this.providerJobsService.updateOffer(req.user.userId, id, dto);
    }

    @Patch('offers/:id/withdraw')
    @ApiOperation({ summary: 'Withdraw a pending offer' })
    withdrawOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<OfferEntity> {
        return this.providerJobsService.withdrawOffer(req.user.userId, id);
    }

    @Get('workers/availability')
    @ApiOperation({ summary: 'Check worker availability for a job schedule' })
    getWorkerAvailability(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query() query: GetWorkerAvailabilityQueryDto,
    ) {
        return this.providerJobsService.getWorkerAvailability(
            req.user.userId,
            query.jobId,
            query.scheduledAt,
        );
    }

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get provider requests dashboard stats' })
    getDashboardStats(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.providerJobsService.getDashboardStats(req.user.userId);
    }

    @Get('dashboard/workers')
    @ApiOperation({ summary: 'Get list of provider workers (includes self for solo orgs)' })
    getWorkers(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.providerJobsService.getWorkers(req.user.userId);
    }

    @Get('workers/self')
    @ApiOperation({ summary: 'Get or create the provider self worker profile' })
    getSelfWorker(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.providerJobsService.getSelfWorker(req.user.userId);
    }
}
