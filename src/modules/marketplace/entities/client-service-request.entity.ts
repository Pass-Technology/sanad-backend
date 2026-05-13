import { Entity, Column, ManyToOne, OneToMany, OneToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { ClientAddressEntity } from '../../client/entity/client-address.entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { ServiceEntity } from '../../service-management/entities/service.entity';
import { RequestStatus } from '../enums/request-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { JobEntity } from './job.entity';
import { OfferEntity } from './offer.entity';


@Entity('client_service_requests')
export class ClientServiceRequestEntity extends BaseEntity {

    @ManyToOne(() => ClientProfileEntity, (client) => client.clientServiceRequests, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;

    //global service entity acting as reference to filter providers in that service category
    @ManyToOne(() => ServiceEntity, { nullable: false })
    @JoinColumn({ name: 'service_id' })
    service: ServiceEntity;

    @Column({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.OPEN,
    })
    status: RequestStatus;

    // client's description of the request
    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', nullable: true })
    scheduledAt: Date;

    // links to client's saved address — client can pick an existing address or add a new one
    @ManyToOne(() => ClientAddressEntity, { nullable: true })
    @JoinColumn({ name: 'address_id' })
    address: ClientAddressEntity;

    @Column({ type: 'boolean', default: false })
    isUrgent: boolean;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        nullable: true,
    })
    paymentMethod: PaymentMethod;

    /** Client's budget estimate — informational only, not binding */
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    budgetEstimate: number;

    /** Service-specific details (rooms, property type, space size, etc.) */
    @Column({ type: 'jsonb', nullable: true })
    details: Record<string, any>;

    /** Request auto-closes after this timestamp */
    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

    @OneToMany(() => OfferEntity, (offer) => offer.clientServiceRequest)
    offers: OfferEntity[];

    @OneToOne(() => JobEntity, (job) => job.serviceRequest)
    job: JobEntity;

    /** Providers who dismissed/rejected this request from their feed */
    @ManyToMany(() => ProviderProfileEntity)
    @JoinTable({ name: 'request_rejections' })
    rejectedByProviders: ProviderProfileEntity[];
}
