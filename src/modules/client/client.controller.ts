import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';

@ApiTags('client')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.CLIENT)
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get current client profile' })
    async getProfile(@CurrentUser() user: UserInfoResponseWithTokensDto) {
        return await this.clientService.getProfile(user.userId);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Create/Update client profile' })
    async updateProfile(
        @CurrentUser() user: UserInfoResponseWithTokensDto,
        @Body() dto: CreateClientProfileDto,
    ) {
        return await this.clientService.createProfile(user.userId, dto);
    }
}