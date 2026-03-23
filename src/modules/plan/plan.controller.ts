import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
    constructor(private readonly planService: PlanService) { }

    @Get('views')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get plans grouped by billing cycles (localized)' })
    async getPlanViews(@Headers('accept-language') lang: string = 'en') {
        return this.planService.getPlanViews(lang);
    }
}
