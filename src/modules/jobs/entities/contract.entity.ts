import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { WorkerProfileEntity } from '../../worker/entity/worker-profile.entity';
import { JobEntity } from './job.entity';
import { OfferEntity } from './offer.entity';
import { ContractStatus } from '../enums/contract-status.enum';
import { ReviewEntity } from './review.entity';

@Entity('contracts')
export class ContractEntity extends BaseEntity {
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({
        type: 'enum',
        enum: ContractStatus,
        default: ContractStatus.ACTIVE,
    })
    status: ContractStatus;

    @Column({ type: 'timestamp', nullable: true })
    scheduledAt: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    clientStartingDate: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    workerStartingDate: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    clientEndingDate: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    workerEndingDate: Date | null;

    @Column({ type: 'boolean', default: false })
    hasBeenStarted: boolean;

    @Column({ type: 'boolean', default: false })
    hasBeenCompleted: boolean;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date | null;

    @OneToOne(() => JobEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'job_id' })
    job: JobEntity;

    @OneToOne(() => OfferEntity, { onDelete: 'RESTRICT', nullable: false })
    @JoinColumn({ name: 'accepted_offer_id' })
    acceptedOffer: OfferEntity;

    @ManyToOne(() => ClientProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;

    @ManyToOne(() => ProviderProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @ManyToOne(() => WorkerProfileEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assigned_worker_id' })
    assignedWorker: WorkerProfileEntity | null;

    @OneToMany(() => ReviewEntity, (review) => review.contract)
    reviews: ReviewEntity[];
}
