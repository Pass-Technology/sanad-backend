import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { AssetTypeEnum } from '../enums/asset-type.enum';

@Entity('asset_types')
export class AssetTypeEntity extends BaseEntity {
    @Column({
        type: 'enum',
        enum: AssetTypeEnum,
        unique: true,
    })
    name: AssetTypeEnum;


}
