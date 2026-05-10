import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { ProviderWorkerEntity } from '../../provider-profile/entities/provider-worker.entity';
import { OrderEntity } from './order.entity';
import { OfferStatus } from '../enums/order-status.enum';

@Entity('offers')
@Unique(['order', 'provider'])
export class OfferEntity extends BaseEntity {
    @ManyToOne(() => OrderEntity, (order) => order.offers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;

    @ManyToOne(() => ProviderProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @ManyToOne(() => ProviderWorkerEntity, { nullable: true })
    @JoinColumn({ name: 'worker_id' })
    worker: ProviderWorkerEntity | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({
        type: 'enum',
        enum: OfferStatus,
        default: OfferStatus.PENDING,
    })
    status: OfferStatus;
}
