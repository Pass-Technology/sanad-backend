import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfileEntity } from './provider-profile.entity';
import { BaseEntity } from '../../../database/base-entity';

@Entity('provider_compliance')
export class ProviderComplianceEntity extends BaseEntity {

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.compliance, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    providerProfile: ProviderProfileEntity;

    @Column()
    ownerIdFile: string;

    @Column()
    ownerIdExpiryDate: string;

    @Column()
    tradeLicenseFile: string;

    @Column()
    tradeLicenseExpiryDate: string;


}
