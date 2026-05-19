import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ClientFavoritesService } from './client-favorites.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';

@ApiTags('Client Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.CLIENT)
@Controller('client/favorites')
export class ClientFavoritesController {
    constructor(private readonly clientFavoritesService: ClientFavoritesService) { }

    @Get()
    @ApiOperation({ summary: 'Get unified list of favorite services and providers' })
    async getFavorites(
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ): Promise<FavoritesResponseDto> {
        return this.clientFavoritesService.getFavorites(req.user.userId);
    }

    @Post('services/:serviceId')
    @ApiOperation({ summary: 'Add a service category to favorites' })
    async addFavoriteService(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('serviceId') serviceId: string,
    ): Promise<void> {
        await this.clientFavoritesService.addFavoriteService(req.user.userId, serviceId);
    }

    @Delete('services/:serviceId')
    @ApiOperation({ summary: 'Remove a service category from favorites' })
    async removeFavoriteService(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('serviceId') serviceId: string,
    ): Promise<void> {
        await this.clientFavoritesService.removeFavoriteService(req.user.userId, serviceId);
    }

    @Post('providers/:providerId')
    @ApiOperation({ summary: 'Add a provider profile to favorites' })
    async addFavoriteProvider(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('providerId') providerId: string,
    ): Promise<void> {
        await this.clientFavoritesService.addFavoriteProvider(req.user.userId, providerId);
    }

    @Delete('providers/:providerId')
    @ApiOperation({ summary: 'Remove a provider profile from favorites' })
    async removeFavoriteProvider(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('providerId') providerId: string,
    ): Promise<void> {
        await this.clientFavoritesService.removeFavoriteProvider(req.user.userId, providerId);
    }
}
