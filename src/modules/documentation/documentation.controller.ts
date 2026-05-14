import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { DocumentationService } from './documentation.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('Provider Documentation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@UserTypes(UserType.PROVIDER)
@Controller('provider/documentation')
export class DocumentationController {
    constructor(private readonly documentationService: DocumentationService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get documentation dashboard stats and list' })
    async getDashboard(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return await this.documentationService.getDashboardData(req.user.userId);
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload or update a document' })
    async uploadDocument(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: UploadDocumentDto
    ) {
        return await this.documentationService.uploadDocument(req.user.userId, dto);
    }
}
