import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AssetEntity } from "./entities/asset.entity";
import { AssetTypeEntity } from "./entities/asset-type.entity";
import { AssetTypeEnum } from "./enums/asset-type.enum";
import { AssetOwnerTypeEnum } from "./enums/asset-owner-type.enum";
import { IStorageProvider, STORAGE_PROVIDER } from "./interfaces/storage-provider.interface";

@Injectable()
export class UploadAssetsService {
    constructor(
        @InjectRepository(AssetEntity)
        private assetRepository: Repository<AssetEntity>,
        @InjectRepository(AssetTypeEntity)
        private assetTypeRepository: Repository<AssetTypeEntity>,
        @Inject(STORAGE_PROVIDER)
        private storageProvider: IStorageProvider,
    ) { }

    async uploadAsset(
        file: Express.Multer.File,
        ownerId: string,
        ownerType: AssetOwnerTypeEnum,
        typeName: AssetTypeEnum,
    ): Promise<AssetEntity> {

        const assetType = await this.assetTypeRepository.findOne({
            where: { name: typeName }
        });

        if (!assetType) {
            throw new NotFoundException(`Asset type with name "${typeName}" not found`);
        }

        const folder = `${ownerType.toLowerCase()}/${ownerId}`;
        const { path, url } = await this.storageProvider.upload(file, folder);

        const asset = this.assetRepository.create({
            fileName: path.split('/').pop(),
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: path,
            url: url,
            ownerId: ownerId,
            ownerType: ownerType,
            type: assetType,
        });

        return await this.assetRepository.save(asset);
    }

    async getAssetsByOwner(ownerId: string, ownerType: AssetOwnerTypeEnum): Promise<AssetEntity[]> {
        return await this.assetRepository.find({
            where: { ownerId, ownerType },
            relations: { type: true },
        });
    }

    async getAssetsByOwnerAndType(
        ownerId: string,
        ownerType: AssetOwnerTypeEnum,
        typeName: AssetTypeEnum
    ): Promise<AssetEntity[]> {
        return await this.assetRepository.find({
            where: {
                ownerId,
                ownerType,
                type: { name: typeName },
            },
            relations: { type: true },
        });
    }

    async deleteAsset(id: string): Promise<void> {
        const asset = await this.assetRepository.findOne({ where: { id } });
        if (!asset) {
            throw new NotFoundException(`Asset with ID ${id} not found`);
        }

        // Delete from storage
        await this.storageProvider.delete(asset.path);

        // Delete from DB
        await this.assetRepository.remove(asset);
    }
}