import { Controller, Get } from "@nestjs/common";
import { LookUpService } from "./lookup.service";

@Controller('lookups')
export class LookUpController {
    constructor(private readonly lookUpService: LookUpService) { }

    @Get('profile-status')
    async getProfileStatus() {
        return await this.lookUpService.getProfileStatus()
    }

    @Get('provider-types')
    async getProviderTypes() {
        return await this.lookUpService.getProviderTypes()
    }

    @Get('company-types')
    async getCompanyTypes() {
        return await this.lookUpService.getCompanyTypes()
    }

    @Get('billing-cycles')
    async getBillingCycles() {
        return await this.lookUpService.getBillingCycles()
    }
}