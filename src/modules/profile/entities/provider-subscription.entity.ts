import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { ProviderProfileEntity } from './provider-profile.entity';
import { LookUpBillingCycleEntity } from '../lookup-tables/entities/lookup-biling-cycle.entity';
import { BaseEntity } from '../../../shared/base-entity';

@Entity('provider_subscriptions')
export class ProviderSubscriptionEntity extends BaseEntity {

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.subscription, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfileEntity;

    @Column()
    selectedPlanId: string;


    @Column({ type: 'varchar', default: 'monthly' })
    billingCycleId: string;

    @ManyToOne(() => LookUpBillingCycleEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'billingCycleId' })
    billingCycle: LookUpBillingCycleEntity;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;
}
