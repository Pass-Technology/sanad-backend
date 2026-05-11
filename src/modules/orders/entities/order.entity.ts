import { Entity, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { ServiceEntity } from '../../service-management/entities/service.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { OfferEntity } from './offer.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
    @ManyToOne(() => ClientProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;

    @ManyToOne(() => ServiceEntity, { nullable: false })
    @JoinColumn({ name: 'service_id' })
    service: ServiceEntity;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', nullable: true })
    scheduledAt: Date;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    lat: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    lng: number;

    @Column({ type: 'boolean', default: false })
    isUrgent: boolean;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        nullable: true,
    })
    paymentMethod: PaymentMethod;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    totalEstimate: number;

    @Column({ type: 'jsonb', nullable: true })
    details: any;
    
    @Column({ type: 'jsonb', nullable: true })
    beforeServicePhotos: string[];

    @Column({ type: 'jsonb', nullable: true })
    afterServicePhotos: string[];

    @Column({ type: 'text', nullable: true })
    customerSignature: string;

    @Column({ type: 'timestamp', nullable: true })
    startedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    @OneToMany(() => OfferEntity, (offer) => offer.order)
    offers: OfferEntity[];

    @ManyToOne(() => OfferEntity, { nullable: true })
    @JoinColumn({ name: 'accepted_offer_id' })
    acceptedOffer: OfferEntity;

    @ManyToMany(() => ProviderProfileEntity)
    @JoinTable({ name: 'order_rejections' })
    rejectedByProviders: ProviderProfileEntity[];
}
