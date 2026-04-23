import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ServiceEntity } from './service.entity';
import { ProviderProfileEntity } from '../../profile/entities/provider-profile.entity';
import { ProviderServicePricingEntity } from '../entities/provider-service-pricing.entity';

@Entity('provider_services')
export class ProviderServiceEntity extends BaseEntity {
    @Column({ type: 'text', nullable: true })
    description: string | null;

    @ManyToOne(() => ProviderProfileEntity, (profile) => profile.providerServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: ProviderProfileEntity;

    @ManyToOne(() => ServiceEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: ServiceEntity;

    @OneToMany(() => ProviderServicePricingEntity, (pricing) => pricing.providerService, { cascade: true })
    pricingDetails: ProviderServicePricingEntity[];
}
