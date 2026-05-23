import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderServiceEntity } from './provider-service.entity';
import { LookupUnitEntity } from '../../lookups/entities/lookup-unit.entity';
import { LookupCurrencyEntity } from '../../lookups/entities/lookup-currency.entity';

@Entity('provider_service_pricing')
export class ProviderServicePricingEntity extends BaseEntity {
    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @ManyToOne(() => LookupUnitEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'unit_id' })
    unit: LookupUnitEntity | null;

    @ManyToOne(() => LookupCurrencyEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'currency_id' })
    currency: LookupCurrencyEntity | null;

    @ManyToOne(() => ProviderServiceEntity, (providerService) => providerService.pricingDetails, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_service_id' })
    providerService: ProviderServiceEntity;
}

