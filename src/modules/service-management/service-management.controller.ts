import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { ServiceManagementService } from './service-management.service';

@ApiTags('Service Management')
@Controller('service-management')
export class ServiceManagementController {
    constructor(private readonly serviceManagementService: ServiceManagementService) { }

    @Get('categories')
    @ApiOperation({ summary: 'Get all active categories with their services' })
    async findAllCategories() {
        return this.serviceManagementService.findAllCategories();
    }

    @Get('categories/:categoryId/services')
    @ApiOperation({ summary: 'Get services for a specific category' })
    @ApiParam({ name: 'categoryId', description: 'Category UUID' })
    async getServicesByCategory(@Param('categoryId') categoryId: string) {
        return this.serviceManagementService.getServicesByCategory(categoryId);
    }
}
