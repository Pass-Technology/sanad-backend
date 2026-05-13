import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { ClientServiceRequestEntity } from './client-service-request.entity';
import { OfferStatus } from '../enums/offer-status.enum';

@Entity('offers')
@Unique(['clientServiceRequest', 'provider'])
export class OfferEntity extends BaseEntity {
    @ManyToOne(() => ClientServiceRequestEntity, (csr) => csr.offers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_request_id' })
    clientServiceRequest: ClientServiceRequestEntity;

    @ManyToOne(() => ProviderProfileEntity, (provider) => provider.offers, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'int', nullable: true })
    estimatedDurationMinutes: number;

    @Column({
        type: 'enum',
        enum: OfferStatus,
        default: OfferStatus.PENDING,
    })
    status: OfferStatus;

    /** Offer expires after this timestamp — stale offers cannot be accepted */
    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

}
