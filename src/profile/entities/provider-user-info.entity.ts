import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfile } from './provider-profile.entity';


@Entity('provider_user_info')
export class ProviderUserInfo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
