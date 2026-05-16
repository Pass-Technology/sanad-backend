import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProviderProfileEntity } from './provider-profile.entity';
import { LookUpProfileStatusEntity } from '../../lookups/entities/lookup-profile-status.entity';
import { ProfileChangeType } from '../enums/profile-change-type.enum';
import { BaseEntity } from '../../../database/base-entity';

@Entity('provider_profile_changes')
export class ProviderProfileChangeEntity extends BaseEntity {

    @ManyToOne(() => ProviderProfileEntity)
    @JoinColumn({ name: 'profileId' })
    providerProfile: ProviderProfileEntity;

    @Column()
    profileId: string;

    @Column({
        type: 'enum',
        enum: ProfileChangeType,
    })
    changeType: ProfileChangeType;

    @Column({ type: 'jsonb', nullable: true })
    oldData: any;

    @Column({ type: 'jsonb' })
    newData: any;

    @ManyToOne(() => LookUpProfileStatusEntity)
    @JoinColumn({ name: 'statusId' })
    status: LookUpProfileStatusEntity;

    @Column()
    statusId: string;

    @Column({ type: 'text', nullable: true })
    adminNote: string;

}
