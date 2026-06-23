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
} from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { ServiceManagementService } from './service-management.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ToggleServiceDto } from './Dto/toggle-service.dto';

@ApiTags('Service Management')
@Controller('service-management')
export class ServiceManagementController {
    constructor(private readonly serviceManagementService: ServiceManagementService) {}

    @Get('categories')
    @ApiOperation({ summary: 'Get all active categories with their services' })
    @ApiQuery({ name: 'searchString', required: false, type: String })
    async findAllCategories(
        @Headers('accept-language') lang: string = 'en',
        @Query('searchString') searchString?: string,
    ) {
        return this.serviceManagementService.findAllCategories(lang, searchString);
    }

    @Get('categories/:categoryId/services')
    @ApiOperation({ summary: 'Get services for a specific category' })
    @ApiParam({ name: 'categoryId', description: 'Category UUID' })
    async getServicesByCategory(
        @Param('categoryId') categoryId: string,
        @Headers('accept-language') lang: string = 'en',
    ) {
        return await this.serviceManagementService.getServicesByCategory(
            categoryId,
            lang,
        );
    }

    @Get('services/:serviceId')
    @ApiOperation({ summary: 'Get a single service by ID' })
    @ApiParam({ name: 'serviceId', description: 'Service UUID' })
    async findServiceById(
        @Param('serviceId') serviceId: string,
        @Headers('accept-language') lang: string = 'en',
    ) {
        return this.serviceManagementService.findServiceById(serviceId, lang);
    }

    // TODO: remove this once frontend migrate to the same endpoint in Provider Service Controller
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
