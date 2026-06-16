import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderServiceEntity } from './provider-service.entity';

@Entity('provider_service_pricing')
export class ProviderServicePricingEntity extends BaseEntity {
    @Column({ type: 'jsonb', nullable: true, default: { en: 'price details description', ar: 'وصف الفئة' } })
    description?: { en: string; ar: string } | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @ManyToOne(() => ProviderServiceEntity, (providerService) => providerService.pricingDetails, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'provider_service_id' })
    providerService: ProviderServiceEntity;
}
