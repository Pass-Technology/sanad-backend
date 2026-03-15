import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { ProviderProfileEntity } from './provider-profile.entity';
import { LookUpBillingCycleEntity } from '../lookup-tables/entities/lookup-biling-cycle.entity';
import { BaseEntity } from '../../../database/base-entity';
import { SubscriptionPlanEntity } from '../../subscription/entity/subscription-plan.entity';

@Entity('provider_subscriptions')
export class ProviderSubscriptionEntity extends BaseEntity {

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.subscription, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    providerProfile: ProviderProfileEntity;

    // commented out until we figure out what to do with subscription
    @ManyToOne(() => SubscriptionPlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    selectedPlanId: SubscriptionPlanEntity;
    // selectedPlanId: string;

    @ManyToOne(() => LookUpBillingCycleEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    billingCycleId: LookUpBillingCycleEntity;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;
}
