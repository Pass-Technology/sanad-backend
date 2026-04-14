import { Controller, Get, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ScoringSystemService } from './scoring-system.service';

@ApiTags('scoring-system')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('scoring')
export class ScoringSystemController {
    constructor(private readonly scoringService: ScoringSystemService) { }

    @Get('profile-score')
    @ApiOperation({ summary: 'Get provider profile completion score' })
    async getProfileScore(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.scoringService.getScore(req.user.userId);
    }
}
