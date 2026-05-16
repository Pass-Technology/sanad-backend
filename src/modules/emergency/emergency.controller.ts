import { Controller, Get, Post, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { EmergencyService } from './emergency.service';
import { UpdateEmergencyServicesDto, ToggleEmergencyModeDto } from './dto/emergency-mode.dto';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('Provider Emergency Mode')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.PROVIDER)
@Controller('provider/emergency')
export class EmergencyController {
    constructor(private readonly emergencyService: EmergencyService) { }

    @Get('status')
    @ApiOperation({ summary: 'Get current emergency mode status and stats' })
    async getStatus(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.emergencyService.getStatus(req.user.userId);
    }

    @Post('toggle')
    @ApiOperation({ summary: 'Activate or deactivate emergency mode' })
    async toggleMode(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: ToggleEmergencyModeDto
    ) {
        return await this.emergencyService.toggleMode(req.user.userId, dto);
    }

    @Patch('services')
    @ApiOperation({ summary: 'Update services available for emergency mode' })
    async updateServices(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: UpdateEmergencyServicesDto
    ) {
        return await this.emergencyService.updateEmergencyServices(req.user.userId, dto);
    }
}
