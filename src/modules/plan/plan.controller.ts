import { Controller, Get, Headers } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
    constructor(private readonly planService: PlanService) { }

    @Get('views')
    @ApiOperation({ summary: 'Get plans' })
    async getPlanViews(@Headers('accept-language') lang: string = 'en') {
        return this.planService.getPlanViews(lang);
    }
}
