import { Controller, Get, Headers, Query, UseGuards } from "@nestjs/common";
import { LookUpService } from "./lookup.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { VerificationGuard } from '../user/guards/verification.guard';


@ApiTags('lookup-tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard)
@Controller('lookups')
export class LookUpController {
    constructor(private readonly lookUpService: LookUpService) { }

    @Get('profile-status')
    @ApiOperation({ summary: 'get profile statuses' })
    async getProfileStatus(@Headers('accept-language') lang: string = 'en') {
        return await this.lookUpService.getProfileStatus(lang)
    }

    @Get('provider-types')
    @ApiOperation({ summary: 'get provider types' })
    async getProviderTypes(@Headers('accept-language') lang: string = 'en') {
        return await this.lookUpService.getProviderTypes(lang)
    }

    @Get('company-types')
    @ApiOperation({ summary: 'get company types' })
    async getCompanyTypes(@Headers('accept-language') lang: string = 'en') {
        return await this.lookUpService.getCompanyTypes(lang)
    }

    @Get('languages')
    @ApiOperation({ summary: 'get languages' })
    async getLanguages(@Headers('accept-language') lang: string = 'en') {
        return await this.lookUpService.getLanguages(lang)
    }

    @Get('payments')
    @ApiOperation({ summary: 'get payment lookups' })
    async getPaymentLookups(
        @Headers('accept-language') lang: string = 'en',
    ) {
        return await this.lookUpService.getPaymentLookups(lang)
    }

    @Get('nationalities')
    @ApiOperation({ summary: 'get nationalities' })
    async getNationalities(@Headers('accept-language') lang: string = 'en') {
        return await this.lookUpService.getNationalities(lang)
    }

    @Get('cities')
    @ApiOperation({ summary: 'get UAE cities' })
    async getCities(@Headers('accept-language') lang: string = 'en') {
        return await this.lookUpService.getCities(lang)
    }
}

// shared lookup table
// column => name
// column => lookupCategoryId (FK)

//look up category table
// column => name ex: companyType id = 1
