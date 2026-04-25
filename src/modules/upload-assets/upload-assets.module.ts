import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadAssetsService } from "./upload-assets.service";
import { AssetEntity } from "./entities/asset.entity";
import { AssetTypeEntity } from "./entities/asset-type.entity";
import { STORAGE_PROVIDER } from "./interfaces/storage-provider.interface";
import { S3StorageProvider } from "./providers/s3.provider";


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([AssetEntity, AssetTypeEntity])
    ],
    controllers: [],
    providers: [UploadAssetsService,
        {
            provide: STORAGE_PROVIDER,
            useClass: S3StorageProvider,
        }
    ],
    exports: [UploadAssetsService, STORAGE_PROVIDER]
})
export class UploadAssetsModule { }