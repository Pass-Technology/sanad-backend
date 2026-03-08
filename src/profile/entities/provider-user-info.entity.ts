import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfile } from './provider-profile.entity';
import { BaseEntity } from '../../shared/base-entity';


@Entity('provider_user_info')
export class ProviderUserInfo extends BaseEntity {

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfile, (profile) => profile.userInfo, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfile;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column({ type: 'varchar', nullable: true })
    mobileNumber: string | null;

    @Column()
    nationalId: string;

    @Column({ type: 'varchar', nullable: true })
    dateOfBirth: string | null;

}
