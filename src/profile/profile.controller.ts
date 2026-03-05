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
import { CreateCompanyInfoDto } from './dto/step-1-company-info.dto';
import { CreateUserInfoDto } from './dto/step-2-user-info.dto';
import { CreateBranchesDto, CreateBranchDto } from './dto/step-3-branches.dto';
import { CreateServicesDto } from './dto/step-4-services.dto';
import { CreateComplianceDto } from './dto/step-5-compliance.dto';
import { CreatePaymentDto } from './dto/step-6-payment.dto';
import { CreateSubscriptionDto } from './dto/step-7-subscription.dto';
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

    @Post('setup/step-1')
    @ApiOperation({ summary: 'Step 1 – Submit company information' })
    async step1(
        @Request() req: { user: UserInfoResponseDto },
        @Body() dto: CreateCompanyInfoDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.submitStep1(req.user.userId, dto);
    }

    @Post('setup/step-2')
    @ApiOperation({ summary: 'Step 2 – Submit user personal information' })
    async step2(
        @Request() req: { user: UserInfoResponseDto },
        @Body() dto: CreateUserInfoDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.submitStep2(req.user.userId, dto);
    }

    @Post('setup/step-3')
    @ApiOperation({ summary: 'Step 3 – Submit branches and serving areas' })
    async step3(
        @Request() req: { user: UserInfoResponseDto },
        @Body() dto: CreateBranchesDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.submitStep3(req.user.userId, dto);
    }

    @Post('setup/step-4')
    @ApiOperation({ summary: 'Step 4 – Submit selected services' })
    async step4(
        @Request() req: { user: UserInfoResponseDto },
        @Body() dto: CreateServicesDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.submitStep4(req.user.userId, dto);
    }

    @Post('setup/step-5')
    @ApiOperation({ summary: 'Step 5 – Submit compliance documents' })
    async step5(
        @Request() req: { user: UserInfoResponseDto },
        @Body() dto: CreateComplianceDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.submitStep5(req.user.userId, dto);
    }

    @Post('setup/step-6')
    @ApiOperation({ summary: 'Step 6 – Submit bank & payment details' })
    async step6(
        @Request() req: { user: UserInfoResponseDto },
        @Body() dto: CreatePaymentDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.submitStep6(req.user.userId, dto);
    }

    @Post('setup/step-7')
    @ApiOperation({ summary: 'Step 7 – Submit subscription & finalize profile' })
    async step7(
        @Request() req: { user: UserInfoResponseDto },
        @Body() dto: CreateSubscriptionDto,
    ): Promise<StepResponseDto> {
        return await this.profileService.submitStep7(req.user.userId, dto);
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
