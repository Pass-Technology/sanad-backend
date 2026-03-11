import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfileEntity } from './provider-profile.entity';
import { BaseEntity } from '../../../database/base-entity';


@Entity('provider_user_info')
export class ProviderUserInfoEntity extends BaseEntity {

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.userInfo, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    providerProfile: ProviderProfileEntity;

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
