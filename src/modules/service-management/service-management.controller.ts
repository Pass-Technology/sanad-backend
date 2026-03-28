import { Controller, Get, Param, Headers, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ServiceManagementService } from './service-management.service';

@ApiTags('Service Management')
@Controller('service-management')
export class ServiceManagementController {
    constructor(private readonly serviceManagementService: ServiceManagementService) { }

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
}
