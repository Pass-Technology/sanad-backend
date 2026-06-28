import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { InvitationStatus } from '../enums/invitation-status.enum';

@Entity('worker_invitations')
export class WorkerInvitationEntity extends BaseEntity {
    @Column()
    emailOrPhone: string;

    @Column()
    name: string;

    @Column({ unique: true })
    token: string;

    @Column({
        type: 'enum',
        enum: InvitationStatus,
        default: InvitationStatus.PENDING,
    })
    status: InvitationStatus;

    @ManyToOne(() => ProviderProfileEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @Column({ type: 'timestamp' })
    expiresAt: Date;
}
