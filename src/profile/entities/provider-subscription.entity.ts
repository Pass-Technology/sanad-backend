import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { ProviderProfile } from './provider-profile.entity';
import { LookUpBillingCycle } from '../../lookup/entities/lookup-biling-cycle.entity';
import { BaseEntity } from '../../shared/base-entity';

@Entity('provider_subscriptions')
export class ProviderSubscription extends BaseEntity {

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfile, (profile) => profile.subscription, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfile;

    @Column()
    selectedPlanId: string;


    @Column({ type: 'varchar', default: 'monthly' })
    billingCycleId: string;

    @ManyToOne(() => LookUpBillingCycle, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'billingCycleId' })
    billingCycle: LookUpBillingCycle;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;
}
