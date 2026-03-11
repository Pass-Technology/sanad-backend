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

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.subscription, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    providerProfile: ProviderProfileEntity;

    @Column({ type: 'uuid' })
    selectedPlanId: string;

    @ManyToOne(() => SubscriptionPlanEntity, { onDelete: 'CASCADE' })
    selectedPlan: SubscriptionPlanEntity;

    @Column({ type: 'uuid' })
    billingCycleId: string;

    @ManyToOne(() => LookUpBillingCycleEntity, { onDelete: 'CASCADE' })
    billingCycle: LookUpBillingCycleEntity;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;
}
