import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ServiceEntity } from './service.entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { ProviderServicePricingEntity } from '../entities/provider-service-pricing.entity';
import { ProviderServiceStatus } from '../enums/provider-services-status.enums';
import { Description } from '../interfaces/category-description.interface';

// sepecific provider's services that is different from the global services
@Entity('provider_services')
export class ProviderServiceEntity extends BaseEntity {
    @Column({ type: 'jsonb', nullable: true, default: { en: 'Service description', ar: 'وصف الخدمة' } })
    description: Description | null;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ default: false })
    isEmergencyEnabled: boolean;

    @ManyToOne(() => ProviderProfileEntity, (profile) => profile.providerServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: ProviderProfileEntity;

    @ManyToOne(() => ServiceEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: ServiceEntity;

    @OneToMany(() => ProviderServicePricingEntity, (pricing) => pricing.providerService, { cascade: true })
    pricingDetails: ProviderServicePricingEntity[];

    @Column({ type: 'jsonb', nullable: true })
    availability:
        | {
              day: string;
              slots: { from: string; to: string }[];
          }[]
        | null;

    @Column({
        type: 'enum',
        enum: ProviderServiceStatus,
        default: ProviderServiceStatus.PENDING,
        enumName: 'status',
    })
    status: ProviderServiceStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    minPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    maxPrice: number;
}
