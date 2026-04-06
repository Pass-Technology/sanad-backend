import { Controller, Get, Headers, Query, UseGuards } from "@nestjs/common";
import { LookUpService } from "./lookup.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';


@ApiTags('lookup-tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    @ApiOperation({ summary: 'get payment lookups (Category can be CARD_TYPE, POS_PROVIDER, SETTLEMENT_PREFERENCE)' })
    @ApiQuery({ name: 'category', required: false, type: String })
    async getPaymentLookups(
        @Headers('accept-language') lang: string = 'en',
        @Query('category') category?: string
    ) {
        return await this.lookUpService.getPaymentLookups(category, lang)
    }
}

// shared lookup table
// column => name
// column => lookupCategoryId (FK)

//look up category table
// column => name ex: companyType id = 1
