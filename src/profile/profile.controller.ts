import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { UserInfoResponseDto } from '../user/dto/user-info-response.dto';
import { ProfileService } from './profile.service';
import { CreateBranchDto } from './dto/step-3-branches.dto';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';
import { StepResponseDto, ProgressResponseDto } from './dto/profile-response.dto';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post('setup')
    @ApiOperation({ summary: 'Submit full profile in one request' })
    async submitFullProfile(
        @Request() req: { user: UserInfoResponseDto },
        @Body() dto: CreateFullProfileDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.submitFullProfile(req.user.userId, dto);
    }


    @Get('setup/progress')
    @ApiOperation({ summary: 'Get current setup progress and saved data' })
    async getProgress(
        @Request() req: { user: UserInfoResponseDto },
    ): Promise<ProgressResponseDto> {
        return await this.profileService.getProgress(req.user.userId);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get full completed profile' })
    async getMyProfile(@Request() req: { user: UserInfoResponseDto }) {
        return await this.profileService.getMyProfile(req.user.userId);
    }



    @Put('setup/step-3/branches/:id')
    @ApiOperation({ summary: 'Update an existing branch' })
    @ApiParam({ name: 'id', description: 'Branch UUID' })
    async updateBranch(
        @Request() req: { user: UserInfoResponseDto },
        @Param('id') branchId: string,
        @Body() dto: CreateBranchDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.updateBranch(req.user.userId, branchId, dto);
    }

    @Delete('setup/step-3/branches/:id')
    @ApiOperation({ summary: 'Delete a branch' })
    @ApiParam({ name: 'id', description: 'Branch UUID' })
    async deleteBranch(
        @Request() req: { user: UserInfoResponseDto },
        @Param('id') branchId: string,
    ): Promise<{ message: string }> {
        return await this.profileService.deleteBranch(req.user.userId, branchId);
    }
}
