import { Body, Controller, Get, Post, Put, UseGuards, Request, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TargetAudienceService } from "./target-audience.service";
import { JwtAuthGuard } from "../user/guards/jwt-auth.guard";
import { UserInfoResponseWithTokensDto } from "../user/dto/user-info-response.dto";
import { UpdateTargetAudienceDto } from "./dto/UpdateTargetAudience.dto";

@Controller('target-audience')
@ApiTags('target-audience')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TargetAudienceController {

    constructor(private readonly targetAudienceService: TargetAudienceService) { }

    @Get()
    @ApiOperation({ summary: 'Get target audience profile' })
    async getProfile(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.targetAudienceService.getProfile(req.user.userId);
    }

    @Patch('update-target-audience')
    @ApiOperation({ summary: 'Update target audience profile' })
    async updateTargetAudience(@Request() req: { user: UserInfoResponseWithTokensDto }, @Body() updateTargeAudienceDto: UpdateTargetAudienceDto) {
        return await this.targetAudienceService.updateProfile(req.user.userId, updateTargeAudienceDto);
    }

}