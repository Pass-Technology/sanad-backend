import { Body, Controller, Get, Post, Put, UseGuards, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TargetAudienceService } from "./target-audience.service";
import { JwtAuthGuard } from "../user/guards/jwt-auth.guard";
import { UpdateBasicInfoDto } from "./dto/update-basic-info.dto";
import { UpdateServicesDto } from "./dto/update-services.dto";
import { UpdateOperationsDto } from "./dto/update-operations.dto";
import { UpdateCustomerProfileDto } from "./dto/update-customer-profile.dto";
import { UpdatePurchasingDto } from "./dto/update-purchasing.dto";

@Controller('target-audience')
@ApiTags('target-audience')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TargetAudienceController {

    constructor(private readonly targetAudienceService: TargetAudienceService) { }

    @Get()
    @ApiOperation({ summary: 'Get target audience profile' })
    async getProfile(@Request() req: any) {
        return await this.targetAudienceService.getProfile(req.user.userId);
    }

    @Put('basic-info')
    @ApiOperation({ summary: 'Update basic customer information' })
    async updateBasicInfo(@Request() req: any, @Body() dto: UpdateBasicInfoDto) {
        return await this.targetAudienceService.updateBasicInfo(req.user.userId, dto);
    }

    @Put('services')
    @ApiOperation({ summary: 'Update provided services' })
    async updateServices(@Request() req: any, @Body() dto: UpdateServicesDto) {
        return await this.targetAudienceService.updateServices(req.user.userId, dto);
    }

    @Put('operations')
    @ApiOperation({ summary: 'Update operational readiness' })
    async updateOperations(@Request() req: any, @Body() dto: UpdateOperationsDto) {
        return await this.targetAudienceService.updateOperations(req.user.userId, dto);
    }

    @Put('customer-profile')
    @ApiOperation({ summary: 'Update typical customer profile' })
    async updateCustomerProfile(@Request() req: any, @Body() dto: UpdateCustomerProfileDto) {
        return await this.targetAudienceService.updateCustomerProfile(req.user.userId, dto);
    }

    @Put('purchasing-behavior')
    @ApiOperation({ summary: 'Update purchasing behavior' })
    async updatePurchasing(@Request() req: any, @Body() dto: UpdatePurchasingDto) {
        return await this.targetAudienceService.updatePurchasing(req.user.userId, dto);
    }

}