import { DataSource } from 'typeorm';
import { AssetTypeEntity } from '../../../modules/upload-assets/entities/asset-type.entity';
import { AssetTypeEnum } from '../../../modules/upload-assets/enums/asset-type.enum';

export async function assetTypeSeed(dataSource: DataSource) {
    const repository = dataSource.getRepository(AssetTypeEntity);

    const types = Object.values(AssetTypeEnum);

    for (const type of types) {
        const exists = await repository.findOneBy({ name: type });
        if (!exists) {
            const newType = repository.create({ name: type });
            await repository.save(newType);
            console.log(`Seeded AssetType: ${type}`);
        }
    }
}
