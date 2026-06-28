import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { WorkerProfileEntity } from '../../worker/entity/worker-profile.entity';
import { JobEntity } from './job.entity';
import { OfferStatus } from '../enums/offer-status.enum';

@Entity('offers')
export class OfferEntity extends BaseEntity {
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'int', nullable: true })
    estimatedDuration: number;

    @Column({ type: 'boolean', default: true })
    usesRequestedSchedule: boolean;

    @Column({ type: 'timestamp', nullable: true })
    proposedScheduledAt: Date | null;

    @Column({
        type: 'enum',
        enum: OfferStatus,
        default: OfferStatus.PENDING,
    })
    status: OfferStatus;

    @ManyToOne(() => JobEntity, (job) => job.offers, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'job_id' })
    job: JobEntity;

    @ManyToOne(() => ProviderProfileEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @ManyToOne(() => WorkerProfileEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assigned_worker_id' })
    assignedWorker: WorkerProfileEntity | null;
}
