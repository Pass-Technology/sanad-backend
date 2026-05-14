import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerificationGuard } from '../auth/guards/verification.guard';
import { NotificationService } from './notification.service';
import { UpdateNotificationSettingsDto } from './dto/update-settings.dto';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('Notification Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard)
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    @ApiOperation({ summary: 'Get paginated notifications for current user' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async getNotifications(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Query('limit') limit?: number,
        @Query('offset') offset?: number
    ) {
        return await this.notificationService.getNotifications(req.user.userId, limit, offset);
    }

    @Patch('read-all')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    async markAllAsRead(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.notificationService.markAllAsRead(req.user.userId);
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Mark a specific notification as read' })
    async markAsRead(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string
    ) {
        return await this.notificationService.markAsRead(req.user.userId, id);
    }

    @Get('settings')
    @ApiOperation({ summary: 'Get notification preferences' })
    async getSettings(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.notificationService.getSettings(req.user.userId);
    }

    @Patch('settings')
    @ApiOperation({ summary: 'Update notification preferences' })
    async updateSettings(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: UpdateNotificationSettingsDto
    ) {
        return await this.notificationService.updateSettings(req.user.userId, dto);
    }
}
