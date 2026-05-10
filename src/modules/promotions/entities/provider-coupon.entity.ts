import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';

@Entity('provider_coupons')
export class ProviderCouponEntity extends BaseEntity {
    @Column({ unique: true })
    code: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    @Column({
        type: 'enum',
        enum: ['PERCENTAGE', 'FIXED'],
        default: 'PERCENTAGE'
    })
    discountType: string;

    @Column({ type: 'timestamp' })
    expiryDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => ProviderProfileEntity, (provider) => provider.coupons, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;
}
