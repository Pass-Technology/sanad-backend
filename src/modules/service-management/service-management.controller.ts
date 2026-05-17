import { Controller, Get, Param, Headers, Query, Body, Post, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceManagementService } from './service-management.service';
import { RequestServiceDto } from './Dto/request-service.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ToggleServiceDto } from './Dto/toggle-service.dto';
import { GetMyServicesQueryDto } from './Dto/get-my-services-query.dto';

@ApiTags('Service Management')
@Controller('service-management')
export class ServiceManagementController {
    constructor(private readonly serviceManagementService: ServiceManagementService) { }

    @Get('provider/categories')
    @ApiOperation({ summary: 'Get all categories for provider' })
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    async findProviderCategories(
        @Headers('accept-language') lang: string = 'en',
        @Request() req: { user: UserInfoResponseWithTokensDto }
    ) {
        return this.serviceManagementService.findProviderCategories(lang, req.user.userId);
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all active categories with their services' })
    @ApiQuery({ name: 'searchString', required: false, type: String })
    async findAllCategories(
        @Headers('accept-language') lang: string = 'en',
        @Query('searchString') searchString?: string
    ) {
        return this.serviceManagementService.findAllCategories(lang, searchString);
    }

    @Get('categories/:categoryId/services')
    @ApiOperation({ summary: 'Get services for a specific category' })
    @ApiParam({ name: 'categoryId', description: 'Category UUID' })
    async getServicesByCategory(
        @Param('categoryId') categoryId: string,
        @Headers('accept-language') lang: string = 'en'
    ) {
        return this.serviceManagementService.getServicesByCategory(categoryId, lang);
    }

    @Get('services/:serviceId')
    @ApiOperation({ summary: 'Get a single service by ID' })
    @ApiParam({ name: 'serviceId', description: 'Service UUID' })
    async findServiceById(
        @Param('serviceId') serviceId: string,
        @Headers('accept-language') lang: string = 'en'
    ) {
        return this.serviceManagementService.findServiceById(serviceId, lang);
    }

    @Post('request-service')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Request a new service' })
    async requestService(
        @Body() requestServiceDto: RequestServiceDto,
        @Request() req: { user: UserInfoResponseWithTokensDto }) {
        // console.log(req.user.userId)
        return this.serviceManagementService.requestService(requestServiceDto, req.user.userId);
    }

    @Get('requested-services')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all requested services by user' })
    async getRequestedServices(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.serviceManagementService.getRequestedServices(req.user.userId);
    }

    // get the services of the provider inside the profile
    @Get('my-services')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get paginated provider services with search' })
    async getMyServices(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query() query: GetMyServicesQueryDto,
        @Headers('accept-language') lang: string = 'en'
    ) {
        return await this.serviceManagementService.getMyServices(req.user.userId, query, lang);
    }

    @Post('service-toggle-status')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toggle activation status of a provider service' })
    async toggleStatus(
        @Body() toggleServiceDto: ToggleServiceDto) {
        return await this.serviceManagementService.serviceToggleStatus(toggleServiceDto.id);
    }
}
