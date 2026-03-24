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
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { ProfileService } from './profile.service';
import { CreateBranchDto } from './dto/step-3-branches.dto';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';
import { CreateServicesDto } from './dto/step-4-services.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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


    // update services only in case the user wants to update services
    // should also add new services?
    @Put('setup/step-4/services')
    @ApiOperation({ summary: 'Update selected services on an existing profile' })
    async updateServices(
        @CurrentUser() user: UserInfoResponseWithTokensDto,
        @Body() createServiceDto: CreateServicesDto,
    ) {
        return await this.profileService.updateServices(user.userId, createServiceDto);
    }


    @Put('setup/step-3/branches/:id')
    @ApiOperation({ summary: 'Update an existing branch' })
    @ApiParam({ name: 'id', description: 'Branch UUID' })
    async updateBranch(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') branchId: string,
        @Body() dto: CreateBranchDto,
    ) {
        return await this.profileService.updateBranch(req.user.userId, branchId, dto);
    }

    @Delete('setup/step-3/branches/:id')
    @ApiOperation({ summary: 'Delete a branch' })
    @ApiParam({ name: 'id', description: 'Branch UUID' })
    async deleteBranch(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') branchId: string,
    ): Promise<{ message: string }> {
        return await this.profileService.deleteBranch(req.user.userId, branchId);
    }
}
