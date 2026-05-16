import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';

@ApiTags('client')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.CLIENT)
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get current client profile' })
    async getProfile(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.clientService.getProfile(req.user.userId);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Create/Update client profile' })
    async updateProfile(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.clientService.createProfile(req.user.userId);
    }
}