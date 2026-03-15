import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { PlanCycleEntity } from './plan-cycle.entity';
import { LookUpBillingCycleEntity } from '../../profile/lookup-tables/entities/lookup-biling-cycle.entity';

@Entity('plan_price')
export class PlanPriceEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  planId: string;

  @Column({ type: 'uuid' })
  billingCycleId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', default: 'AED' })
  currency: string;

  @ManyToOne(() => PlanCycleEntity, (plan) => plan.prices)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanCycleEntity;

  @ManyToOne(() => LookUpBillingCycleEntity)
  @JoinColumn({ name: 'billing_cycle_id' })
  billingCycle: LookUpBillingCycleEntity;
}
