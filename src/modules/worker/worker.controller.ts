import { Controller, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { WorkerService } from './worker.service';
import { WorkerProfileEntity } from './entity/worker-profile.entity';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';

@ApiTags('worker')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.WORKER)
@Controller('worker')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) {}

    @Get('profile')
    @ApiOperation({ summary: 'Get current worker profile' })
    async getProfile(@Request() req: { user: UserInfoResponseWithTokensDto }): Promise<WorkerProfileEntity> {
        return await this.workerService.getProfile(req.user.userId);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Ensure worker profile exists' })
    async ensureProfile(@Request() req: { user: UserInfoResponseWithTokensDto }): Promise<WorkerProfileEntity> {
        try {
            return await this.workerService.getProfile(req.user.userId);
        } catch {
            return await this.workerService.createProfile(req.user.userId, req.user.identifier);
        }
    }
}
