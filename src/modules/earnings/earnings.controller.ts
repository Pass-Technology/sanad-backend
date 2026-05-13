import { Controller, Get, Post, Body, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EarningsService } from './earnings.service';
import { EarningsQueryDto } from './dto/earnings-query.dto';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { VerificationGuard } from '../auth/guards/verification.guard';

import { RequestPayoutDto } from './dto/request-payout.dto';

@ApiTags('Provider Earnings')
@ApiBearerAuth()
@Controller('provider/earnings')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.PROVIDER)
export class EarningsController {
    constructor(private readonly earningsService: EarningsService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get earnings statistics for the provider' })
    async getStats(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query() query: EarningsQueryDto
    ) {
        return await this.earningsService.getProviderStats(req.user.userId, query);
    }

    @Get('history')
    @ApiOperation({ summary: 'Get payout history' })
    async getHistory(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.earningsService.getPayoutHistory(req.user.userId);
    }

    @Get('trends')
    @ApiOperation({ summary: 'Get earnings trends for charts' })
    async getTrends(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query() query: EarningsQueryDto
    ) {
        return await this.earningsService.getEarningsTrend(req.user.userId, query);
    }

    @Post('payout-request')
    @ApiOperation({ summary: 'Request a payout' })
    async requestPayout(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: RequestPayoutDto
    ) {
        return await this.earningsService.requestPayout(req.user.userId, dto);
    }
}
