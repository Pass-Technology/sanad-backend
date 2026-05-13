import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { ProviderWorkerEntity } from '../../provider-profile/entities/provider-worker.entity';
import { ClientServiceRequestEntity } from './client-service-request.entity';
import { OfferEntity } from './offer.entity';
import { JobStatus } from '../enums/job-status.enum';

@Entity('jobs')
export class JobEntity extends BaseEntity {
    // LINKS BACK TO REQUEST
    @OneToOne(() => ClientServiceRequestEntity, (sr) => sr.job)
    @JoinColumn({ name: 'service_request_id' })
    serviceRequest: ClientServiceRequestEntity;

    // THE PARTIES
    @ManyToOne(() => ClientProfileEntity, { nullable: false })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;

    @ManyToOne(() => ProviderProfileEntity, { nullable: false })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    //ACCEPTED OFFER (source of truth for how we got here)
    @OneToOne(() => OfferEntity)
    @JoinColumn({ name: 'accepted_offer_id' })
    acceptedOffer: OfferEntity;

    //WORKER (assigned AFTER job creation, not during offer)
    @ManyToOne(() => ProviderWorkerEntity, { nullable: true })
    @JoinColumn({ name: 'assigned_worker_id' })
    assignedWorker: ProviderWorkerEntity;

    //JOB STATUS
    @Column({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.ASSIGNED,
    })
    status: JobStatus;

    // Final price — copied from the accepted offer, immutable
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    finalPrice: number;

    // EXECUTION TIMESTAMPS
    @Column({ type: 'timestamp', nullable: true })
    startedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    //JOB ARTIFACTS (documentation)
    @Column({ type: 'jsonb', nullable: true })
    beforeServicePhotos: string[];

    @Column({ type: 'jsonb', nullable: true })
    afterServicePhotos: string[];

    @Column({ type: 'text', nullable: true })
    customerSignature: string;

    @Column({ type: 'jsonb', nullable: true })
    providerNotes: Record<string, any>;
}
