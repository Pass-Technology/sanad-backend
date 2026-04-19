import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    // Put,
    Patch,
    Request,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ProfileService } from './profile.service';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';
import {
    UpdateCompanyInfoDto,
    UpdateUserInfoDto,
    UpdateComplianceDto,
    UpdateServicesDto,
    UpdateBranchDto,
    UpdateBranchesDto,
} from './dto/update-full-profile.dto';
import { CreateBranchDto } from './dto/create-branches.dto';
// import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UpdatePaymentDto } from '../payment/dto/update-payment.dto';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post('setup')
    @ApiOperation({ summary: 'Submit full profile in one request' })
    async submitFullProfile(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: CreateFullProfileDto,
    ) {
        return await this.profileService.submitFullProfile(req.user.userId, dto);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get full completed profile' })
    async getMyProfile(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.profileService.getMyProfile(req.user.userId);
    }

    @Patch('update/company-info')
    @ApiOperation({ summary: 'Update company profile info' })
    async updateCompanyInfo(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: UpdateCompanyInfoDto,
    ) {
        return await this.profileService.updateCompanyInfo(req.user.userId, dto);
    }

    @Patch('update/user-info')
    @ApiOperation({ summary: 'Update provider user personal info' })
    async updateUserInfo(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: UpdateUserInfoDto,
    ) {
        return await this.profileService.updateUserInfo(req.user.userId, dto);
    }

    @Patch('update/services')
    @ApiOperation({ summary: 'Update selected services' })
    async updateServices(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: UpdateServicesDto,
    ) {
        return await this.profileService.updateServices(req.user.userId, dto);
    }

    @Patch('update/compliance')
    @ApiOperation({ summary: 'Update compliance documents and info' })
    async updateCompliance(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: UpdateComplianceDto,
    ) {
        return await this.profileService.updateCompliance(req.user.userId, dto);
    }

    @Patch('update/payment')
    @ApiOperation({ summary: 'Sync all payment methods (Add, Update, Delete)' })
    async updatePayment(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() updatePaymentDto: UpdatePaymentDto,
    ) {
        return await this.profileService.updatePayment(req.user.userId, updatePaymentDto);
    }

    @Patch('update/branches')
    @ApiOperation({ summary: 'Sync all branches (Add, Update, Delete)' })
    async syncBranches(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() updateBranchesDto: UpdateBranchesDto,
    ) {
        return await this.profileService.syncBranches(req.user.userId, updateBranchesDto);
    }

    @Patch('update/branches/:id')
    @ApiOperation({ summary: 'Partial update of an existing branch' })
    @ApiParam({ name: 'id', description: 'Branch UUID' })
    async patchBranch(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') branchId: string,
        @Body() dto: UpdateBranchDto,
    ) {
        return await this.profileService.updateBranch(req.user.userId, branchId, dto as any);
    }

    @Post('add-new-branch')
    @ApiOperation({ summary: 'Add a new branch to the profile' })
    async addBranch(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() addBranchDto: CreateBranchDto,
    ) {
        return await this.profileService.addBranch(req.user.userId, addBranchDto);
    }

    // @Put('setup/step-3/branches/:id')
    // @ApiOperation({ summary: 'Update an existing branch (Full replacement)' })
    // @ApiParam({ name: 'id', description: 'Branch UUID' })
    // async updateBranch(
    //     @Request() req: { user: UserInfoResponseWithTokensDto },
    //     @Param('id') branchId: string,
    //     @Body() dto: CreateBranchDto,
    // ) {
    //     return await this.profileService.updateBranch(req.user.userId, branchId, dto);
    // }

    @Delete('delete-branch/:id')
    @ApiOperation({ summary: 'Delete a branch' })
    @ApiParam({ name: 'id', description: 'Branch UUID' })
    async deleteBranch(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') branchId: string,
    ) {
        return await this.profileService.deleteBranch(req.user.userId, branchId);
    }
}
