import { Controller, Get, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EarningsService } from './earnings.service';
import { EarningsQueryDto } from './dto/earnings-query.dto';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('provider-earnings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('provider/earnings')
export class EarningsController {
    constructor(private readonly earningsService: EarningsService) {}

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
}
