import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { AssetOwnerTypeEnum } from '../enums/asset-owner-type.enum';
import { AssetTypeEntity } from './asset-type.entity';

@Entity('assets')
export class AssetEntity extends BaseEntity {
    @Column()
    fileName: string;

    @Column()
    originalName: string;

    @Column()
    mimeType: string;

    @Column({ type: 'bigint' })
    size: number;

    @Column()
    path: string;

    @Column({ nullable: true })
    url: string;

    @Column({ default: 'local' })
    provider: string;

    @Column()
    ownerId: string;

    @Column({
        type: 'enum',
        enum: AssetOwnerTypeEnum,
    })
    ownerType: AssetOwnerTypeEnum;

    @ManyToOne(() => AssetTypeEntity)
    @JoinColumn({ name: 'type_id' })
    type: AssetTypeEntity;

    @Column({ name: 'type_id' })
    typeId: string;

}
