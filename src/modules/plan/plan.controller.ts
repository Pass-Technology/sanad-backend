import { Controller, Get } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Get('views')
    @ApiOperation({ summary: 'Get plans grouped by billing cycles (4 views)' })
    async getPlanViews() {
        return this.planService.getPlanViews();
    }
}
