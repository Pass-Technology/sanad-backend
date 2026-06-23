import {
    Controller,
    Get,
    Param,
    Body,
    Post,
    UseGuards,
    Request,
    Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceManagementService } from './service-management.service';
import { RequestServiceDto } from './Dto/request-service.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('Provider Requested Services')
@Controller('service-management/provider')
export class RequestServiceController {
    constructor(private readonly serviceManagementService: ServiceManagementService) {}

    @Post('request-service')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Request a new service' })
    async requestService(
        @Body() requestServiceDto: RequestServiceDto,
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ) {
        return this.serviceManagementService.requestService(
            requestServiceDto,
            req.user.userId,
        );
    }

    @Patch('request-service/:id')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Request a new service' })
    async updateRequstService(
        @Body() requestServiceDto: RequestServiceDto,
        @Param('id') requestServiceId: string,
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ) {
        return await this.serviceManagementService.editRequestService(
            requestServiceDto,
            req.user.userId,
            requestServiceId,
        );
    }

    @Get('requested-services')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all requested services by user' })
    async getRequestedServices(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.serviceManagementService.getRequestedServices(req.user.userId);
    }

    @Get('request-service/:id')
    @UseGuards(JwtAuthGuard, VerificationGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get requested service' })
    async getRequestedService(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') requestServiceId: string,
    ) {
        return await this.serviceManagementService.getRequestedService(
            req.user.userId,
            requestServiceId,
        );
    }
}
