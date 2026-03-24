import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PlanEntity } from "./plan.entity";
import { BillingCycleEntity } from "./billing-cycle.entity";
import { SubscriptionEntity } from "../../../subscription/entities/subscription.entity";

@Entity('plan_prices')
export class PlanPriceEntity extends BaseEntity {

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => PlanEntity, (plan) => plan.prices)
    @JoinColumn({ name: 'plan_id' })
    plan: PlanEntity;

    @ManyToOne(() => BillingCycleEntity, (billingCycle) => billingCycle.prices)
    @JoinColumn({ name: 'billing_cycle_id' })
    billingCycle: BillingCycleEntity;

    @OneToMany(() => SubscriptionEntity, (s) => s.planPrice)
    subscription: SubscriptionEntity[];
}