import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssetOwnerTypeEnum } from '../enums/asset-owner-type.enum';
import { AssetTypeEnum } from '../enums/asset-type.enum';

export class UploadAssetBodyDto {
    @ApiProperty({ enum: AssetOwnerTypeEnum })
    @IsEnum(AssetOwnerTypeEnum)
    ownerType: AssetOwnerTypeEnum;

    @ApiProperty({ example: 'uuid-of-owning-entity' })
    @IsUUID()
    ownerId: string;

    @ApiProperty({ enum: AssetTypeEnum })
    @IsEnum(AssetTypeEnum)
    assetType: AssetTypeEnum;
}
