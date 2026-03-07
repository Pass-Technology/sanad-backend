import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { ProviderProfile } from './provider-profile.entity';
import { LookUpBillingCycle } from '../../lookup/entities/lookup-biling-cycle.entity';

@Entity('provider_subscriptions')
export class ProviderSubscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfile, (profile) => profile.subscription, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfile;

    @Column()
    selectedPlanId: string;

    // @Column({ type: 'enum', enum: BillingCycle })
    // billingCycle: BillingCycle;
    @Column({ type: 'varchar', default: 'monthly' })
    billingCycleId: string;

    @ManyToOne(() => LookUpBillingCycle)
    @JoinColumn({ name: 'billingCycleId' })
    billingCycle: LookUpBillingCycle;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
