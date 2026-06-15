import {
    Controller,
    Get,
    Param,
    Headers,
    Query,
    Body,
    Post,
    UseGuards,
    Request,
    Put,
    Delete,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { ServiceManagementService } from './service-management.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ToggleServiceDto } from './Dto/toggle-service.dto';
import { GetMyServicesQueryDto } from './Dto/get-my-services-query.dto';
import { GetProviderCategoryServicesQueryDto } from './Dto/get-provider-category-services.dto';
import { Availability, AvailabilityDto } from '../provider-profile/dto/availability.dto';

@ApiTags('Provider Service')
@Controller('service-management/provider')
export class ProviderServiceController {
    constructor(private readonly serviceManagementService: ServiceManagementService) {}

    @Get('categories')
    @ApiOperation({ summary: 'Get all categories for provider' })
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    async findProviderCategories(
        @Headers('accept-language') lang: string = 'en',
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ) {
        return this.serviceManagementService.findProviderCategories(
            lang,
            req.user.userId,
        );
    }

    @Get('categories/:id/services')
    @ApiOperation({ summary: 'Get all services for a provider category' })
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    async findProviderCategoryServices(
        @Headers('accept-language') lang: string = 'en',
        @Param('id') categoryId: string,
        @Query() queryDto: GetProviderCategoryServicesQueryDto,
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ) {
        return this.serviceManagementService.findProviderCategoryServices(
            lang,
            req.user.userId,
            categoryId,
            queryDto,
        );
    }

    @Get('services/stats')
    @ApiOperation({ summary: 'Get provider service stats' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, VerificationGuard)
    async getProviderServiceStats(
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ) {
        return await this.serviceManagementService.getProviderServicesStats(
            req.user.userId,
        );
    }

    @Get('services/:serviceId')
    @ApiOperation({ summary: 'Get provider service details' })
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'serviceId', description: 'Servicec UUID' })
    async getProviderService(
        @Param('serviceId') serviceId: string,
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Headers('accept-language') lang: string = 'en',
    ) {
        return this.serviceManagementService.getproviderService(
            serviceId,
            req.user.userId,
            lang,
        );
    }

    @Delete('services/:serviceId')
    @ApiOperation({ summary: 'Delete provider service by id' })
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiParam({ name: 'serviceId', description: 'Servicec UUID' })
    @ApiBearerAuth()
    async deleteProviderService(
        @Param('serviceId') serviceId: string,
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Headers('accept-language') lang: string = 'en',
    ) {
        return this.serviceManagementService.deleteProviderService(
            serviceId,
            req.user.userId,
            lang,
        );
    }

    @Get('services/:serviceId/availability')
    @ApiOperation({ summary: 'Get service availability' })
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiResponse({
        type: Availability,
        isArray: true,
        description: 'Returns service availability',
    })
    async getAvailability(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('serviceId') serviceId: string,
    ) {
        return await this.serviceManagementService.getAvailabilty(
            req.user.userId,
            serviceId,
        );
    }

    @Put('services/:serviceId/availability')
    @ApiOperation({ summary: 'Add or updated availability for a service' })
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    async upsertAvailability(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: AvailabilityDto,
        @Param('serviceId') serviceId: string,
    ) {
        return await this.serviceManagementService.upsertAvailabilty(
            req.user.userId,
            dto,
            serviceId,
        );
    }

    @Get('my-services')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get paginated provider services with search' })
    async getMyServices(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query() query: GetMyServicesQueryDto,
        @Headers('accept-language') lang: string = 'en',
    ) {
        return await this.serviceManagementService.getMyServices(
            req.user.userId,
            query,
            lang,
        );
    }

    @Post('service-toggle-status')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toggle activation status of a provider service' })
    async toggleStatus(
        @Body() toggleServiceDto: ToggleServiceDto,
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ) {
        return await this.serviceManagementService.toggleProviderServicecStatus(
            toggleServiceDto.id,
            req.user.userId,
        );
    }
}
