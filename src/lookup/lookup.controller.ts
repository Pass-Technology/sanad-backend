import { Controller, Get, UseGuards } from "@nestjs/common";
import { LookUpService } from "./lookup.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';


@ApiTags('lookup-tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lookups')
export class LookUpController {
    constructor(private readonly lookUpService: LookUpService) { }

    @Get('profile-status')
    @ApiOperation({ summary: 'get profile statuses' })
    async getProfileStatus() {
        return await this.lookUpService.getProfileStatus()
    }

    @Get('provider-types')
    @ApiOperation({ summary: 'get provider types' })
    async getProviderTypes() {
        return await this.lookUpService.getProviderTypes()
    }

    @Get('company-types')
    @ApiOperation({ summary: 'get company types' })
    async getCompanyTypes() {
        return await this.lookUpService.getCompanyTypes()
    }

    @Get('billing-cycles')
    @ApiOperation({ summary: 'get billing cycles' })
    async getBillingCycles() {
        return await this.lookUpService.getBillingCycles()
    }
}