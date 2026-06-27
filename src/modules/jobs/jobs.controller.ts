import { Controller, Post, Get, Body, Param, UseGuards, Patch, Delete, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AssignWorkerDto } from './dto/assign-worker.dto';

@ApiTags('Jobs (Simplified MVP)')
@ApiBearerAuth()
@Controller('jobs')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new job post (Client only)' })
    @UserTypes(UserType.CLIENT)
    createJob(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: CreateJobDto,
    ) {
        return this.jobsService.createJob(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get list of open jobs' })
    @UserTypes(UserType.CLIENT, UserType.PROVIDER, UserType.WORKER)
    getOpenJobs() {
        return this.jobsService.getOpenJobs();
    }

    @Get('my/offers')
    @ApiOperation({ summary: 'Get all my submitted offers (Provider only)' })
    @UserTypes(UserType.PROVIDER)
    getMyOffers(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.jobsService.getMyOffers(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get job details (Any role)' })
    @UserTypes(UserType.CLIENT, UserType.PROVIDER, UserType.WORKER)
    getJobById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.jobsService.getJobById(id, req.user.userId);
    }

    @Post(':id/offers')
    @ApiOperation({ summary: 'Submit an offer on an open job (Provider only)' })
    @UserTypes(UserType.PROVIDER)
    submitOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: CreateOfferDto,
    ) {
        return this.jobsService.submitOffer(req.user.userId, id, dto);
    }

    @Post('offers/:offerId/accept')
    @ApiOperation({ summary: 'Accept a provider offer — sets job to ASSIGNED (Client only)' })
    @UserTypes(UserType.CLIENT)
    acceptOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('offerId') offerId: string,
    ) {
        return this.jobsService.acceptOffer(req.user.userId, offerId);
    }

    @Delete('offers/:offerId')
    @ApiOperation({ summary: 'Withdraw a pending offer (Provider only)' })
    @UserTypes(UserType.PROVIDER)
    withdrawOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('offerId') offerId: string,
    ) {
        return this.jobsService.withdrawOffer(req.user.userId, offerId);
    }

    @Patch(':id/assign-worker')
    @ApiOperation({ summary: 'Assign a worker to the job (Provider only)' })
    @UserTypes(UserType.PROVIDER)
    assignWorker(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: AssignWorkerDto,
    ) {
        return this.jobsService.assignWorker(req.user.userId, id, dto);
    }

    @Patch(':id/start')
    @ApiOperation({ summary: 'Start job working (Provider or Worker only)' })
    @UserTypes(UserType.PROVIDER, UserType.WORKER)
    startJob(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.jobsService.startJob(req.user.userId, id);
    }

    @Patch(':id/complete')
    @ApiOperation({ summary: 'Mark job as finished and write client review (Provider or Worker only)' })
    @UserTypes(UserType.PROVIDER, UserType.WORKER)
    completeJobByProvider(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: CreateReviewDto,
    ) {
        return this.jobsService.completeJobByProvider(req.user.userId, id, dto);
    }

    @Patch(':id/confirm')
    @ApiOperation({ summary: 'Confirm job as completed and write provider review (Client only)' })
    @UserTypes(UserType.CLIENT)
    confirmCompletion(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: CreateReviewDto,
    ) {
        return this.jobsService.confirmCompletion(req.user.userId, id, dto);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a job post/contract' })
    @UserTypes(UserType.CLIENT, UserType.PROVIDER)
    cancelJob(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.jobsService.cancelJob(req.user.userId, id);
    }
}
