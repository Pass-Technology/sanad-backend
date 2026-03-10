import { Controller, Get, Post, Patch, Delete } from "@nestjs/common";

@Controller('subscriptions')
export class SubscriptionController {

    @Get('plans')
    getPlans() { }

    @Post('plans')
    createPlan() { }

    @Patch('plans/:id')
    updatePlan() { }

    @Delete('plans/:id')
    deactivatePlan() { }
}