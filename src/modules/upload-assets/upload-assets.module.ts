import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadAssetsService } from "./upload-assets.service";
import { AssetEntity } from "./entities/asset.entity";
import { AssetTypeEntity } from "./entities/asset-type.entity";
import { STORAGE_PROVIDER } from "./interfaces/storage-provider.interface";


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([AssetEntity, AssetTypeEntity])
    ],
    controllers: [],
    providers: [UploadAssetsService,
        {
            provide: STORAGE_PROVIDER,
            useValue: {},
            // useClass with the future provider
        }
    ],
    exports: [UploadAssetsService, STORAGE_PROVIDER]
})
export class UploadAssetsModule { }