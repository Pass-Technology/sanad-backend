import { Controller, Post, Get, Body, Param, UseGuards, Query, Patch, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ClientJobsService } from './client-jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { GetClientJobsQueryDto } from './dto/get-client-jobs-query.dto';
import { JobEntity } from './entities/job.entity';
import { ContractEntity } from './entities/contract.entity';

@ApiTags('Client Jobs')
@ApiBearerAuth()
@Controller('client/jobs')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.CLIENT)
export class ClientJobsController {
    constructor(private readonly clientJobsService: ClientJobsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new job post' })
    createJob(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: CreateJobDto,
    ): Promise<JobEntity> {
        return this.clientJobsService.createJob(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get my job posts' })
    getMyJobs(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query() query: GetClientJobsQueryDto,
    ): Promise<JobEntity[]> {
        return this.clientJobsService.getMyJobs(req.user.userId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get job post details' })
    getJobById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<JobEntity> {
        return this.clientJobsService.getJobById(req.user.userId, id);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel an open job post' })
    cancelJob(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<JobEntity> {
        return this.clientJobsService.cancelJob(req.user.userId, id);
    }

    @Post('offers/:id/accept')
    @ApiOperation({ summary: 'Accept an offer — creates a contract' })
    acceptOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ): Promise<ContractEntity> {
        return this.clientJobsService.acceptOffer(req.user.userId, id);
    }
}
