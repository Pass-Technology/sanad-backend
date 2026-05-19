import { Controller, Post, Get, Body, Param, UseGuards, Query, Patch, Delete, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ClientRequestsService } from './client-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { GetClientRequestsQueryDto } from './dto/get-client-requests-query.dto';
import { GetClientJobsQueryDto } from './dto/get-client-jobs-query.dto';

@ApiTags('Client Requests')
@ApiBearerAuth()
@Controller('client-requests')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.CLIENT)
export class ClientRequestsController {
    constructor(private readonly clientRequestsService: ClientRequestsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new service request' })
    createRequest(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: CreateServiceRequestDto,
    ) {
        return this.clientRequestsService.createClientServiceRequest(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get my service requests' })
    getMyRequests(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query() query: GetClientRequestsQueryDto,
    ) {
        return this.clientRequestsService.getClientServiceRequests(req.user.userId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get service request details' })
    getRequestById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.clientRequestsService.getClientRequestById(req.user.userId, id);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a service request' })
    cancelRequest(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.clientRequestsService.cancelRequest(req.user.userId, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a service request' })
    deleteRequest(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.clientRequestsService.deleteRequest(req.user.userId, id);
    }

    @Post('offers/:id/accept')
    @ApiOperation({ summary: 'Accept an offer — creates a Job' })
    acceptOffer(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.clientRequestsService.acceptOffer(req.user.userId, id);
    }

    @Get('jobs')
    @ApiOperation({ summary: 'Get my jobs by type (all, active, scheduled, completed, cancelled)' })
    @ApiQuery({ name: 'type', required: false, enum: ['all', 'active', 'scheduled', 'completed', 'cancelled'] })
    getMyJobs(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('type') type?: string,
        @Query() query?: GetClientJobsQueryDto,
    ) {
        return this.clientRequestsService.getClientJobs(req.user.userId, type, query);
    }

    @Get('jobs/:id')
    @ApiOperation({ summary: 'Get job details' })
    getJobById(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.clientRequestsService.getClientJobById(req.user.userId, id);
    }

    @Patch('jobs/:id/cancel')
    @ApiOperation({ summary: 'Cancel a job' })
    cancelJob(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
    ) {
        return this.clientRequestsService.cancelClientJob(req.user.userId, id);
    }
}
