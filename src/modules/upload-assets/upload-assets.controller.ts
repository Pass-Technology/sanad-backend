import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    ParseUUIDPipe,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { UploadAssetsService } from './upload-assets.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { AssetOwnerTypeEnum } from './enums/asset-owner-type.enum';
import { UploadAssetBodyDto } from './dto/upload-asset-body.dto';

@ApiTags('assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard)
@Controller('assets')
export class UploadAssetsController {
    constructor(private readonly uploadAssetsService: UploadAssetsService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload a file directly via server (multipart/form-data)' })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'ownerType', 'ownerId', 'assetType'],
            properties: {
                file: { type: 'string', format: 'binary' },
                ownerType: { type: 'string', enum: Object.values(AssetOwnerTypeEnum) },
                ownerId: { type: 'string', format: 'uuid' },
                assetType: { type: 'string', enum: ['IMAGE', 'PDF', 'DOCUMENT'] },
            },
        },
    })
    uploadAsset(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UploadAssetBodyDto,
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ) {
        return this.uploadAssetsService.uploadAsset(
            file,
            dto.ownerId,
            dto.ownerType,
            dto.assetType,
            req.user.userId,
        );
    }

    @Get('owner/:ownerType/:ownerId')
    @ApiOperation({ summary: 'List all assets for a given owner' })
    getAssetsByOwner(
        @Param('ownerType') ownerType: AssetOwnerTypeEnum,
        @Param('ownerId', ParseUUIDPipe) ownerId: string,
    ) {
        return this.uploadAssetsService.getAssetsByOwner(ownerId, ownerType);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an asset by ID (removes from S3 and DB)' })
    deleteAsset(@Param('id', ParseUUIDPipe) id: string) {
        return this.uploadAssetsService.deleteAsset(id);
    }
}
