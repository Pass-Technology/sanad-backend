import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { InvitationsService } from './invitations.service';
import { InviteWorkerDto } from './dto/invite-worker.dto';
import { WorkerInvitationEntity } from './entity/worker-invitation.entity';

@ApiTags('Worker Invitations')
@ApiBearerAuth()
@Controller('worker/invitations')
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.PROVIDER)
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) {}

    @Post()
    @ApiOperation({ summary: 'Send a worker invitation (Provider only)' })
    inviteWorker(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: InviteWorkerDto,
    ): Promise<WorkerInvitationEntity> {
        return this.invitationsService.inviteWorker(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sent invitations (Provider only)' })
    getInvitations(@Request() req: { user: UserInfoResponseWithTokensDto }): Promise<WorkerInvitationEntity[]> {
        return this.invitationsService.getInvitations(req.user.userId);
    }
}
