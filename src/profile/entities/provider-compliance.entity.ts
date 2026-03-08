import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfile } from './provider-profile.entity';
import { BaseEntity } from '../../shared/base-entity';

@Entity('provider_compliance')
export class ProviderCompliance extends BaseEntity {

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfile, (profile) => profile.compliance, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfile;

    @Column()
    ownerIdFile: string;

    @Column()
    ownerIdExpiryDate: string;

    @Column()
    tradeLicenseFile: string;

    @Column()
    tradeLicenseExpiryDate: string;


}
