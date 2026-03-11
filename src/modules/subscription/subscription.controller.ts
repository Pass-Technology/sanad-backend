import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { AddFeatureDto } from './dtos/create-feature.dto';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Get('plans')
    @ApiOperation({ summary: 'Get all active subscription plans' })
    @ApiResponse({ status: 200, description: 'List of plans and billing cycles.' })
    getPlans() {
        return this.subscriptionService.getPlans();
    }

    @Post('plans')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new subscription plan' })
    @ApiResponse({ status: 201, description: 'Plan created successfully.' })
    createPlan(@Body() dto: CreatePlanDto) {
        return this.subscriptionService.createPlan(dto);
    }

    @Patch('plans/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing subscription plan' })
    @ApiParam({ name: 'id', description: 'Plan ID', example: 'professional' })
    @ApiResponse({ status: 200, description: 'Plan updated successfully.' })
    updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
        return this.subscriptionService.updatePlan(id, dto);
    }

    @Delete('plans/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deactivate a subscription plan' })
    @ApiParam({ name: 'id', description: 'Plan ID', example: 'professional' })
    @ApiResponse({ status: 200, description: 'Plan deactivated successfully.' })
    deactivatePlan(@Param('id') id: string) {
        return this.subscriptionService.deactivatePlan(id);
    }

    @Post('plans/:planId/features')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a feature to a subscription plan' })
    @ApiParam({ name: 'planId', description: 'Plan ID', example: 'professional' })
    @ApiResponse({ status: 201, description: 'Feature added successfully.' })
    addFeature(
        @Param('planId') planId: string,
        @Body() dto: AddFeatureDto
    ) {
        return this.subscriptionService.addFeature(planId, dto);
    }

    @Get('price-preview')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Preview price for a plan and billing cycle' })
    @ApiQuery({ name: 'planId', description: 'Plan ID', example: 'starter' })
    @ApiQuery({ name: 'billingCycleId', description: 'Billing Cycle ID', example: '3months' })
    @ApiResponse({ status: 200, description: 'Price breakdown calculated.' })
    previewPrice(
        @Query('planId') planId: string,
        @Query('billingCycleId') billingCycleId: string
    ) {
        return this.subscriptionService.calculatePrice(planId, billingCycleId);
    }

    @Get('plans/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get details of a specific internal subscription plan' })
    @ApiParam({ name: 'id', description: 'Plan ID', example: 'starter' })
    @ApiResponse({ status: 200, description: 'Plan details returned.' })
    getPlan(@Param('id') id: string) {
        return this.subscriptionService.getPlan(id);
    }
}