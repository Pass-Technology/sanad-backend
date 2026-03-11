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

    @ManyToOne(() => SubscriptionPlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    selectedPlan: SubscriptionPlanEntity;

    @ManyToOne(() => LookUpBillingCycleEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    billingCycle: LookUpBillingCycleEntity;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;
}
