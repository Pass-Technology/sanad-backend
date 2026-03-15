import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { PlanEntity } from '../../plan/entities/plan.entity';
import { LookUpBillingCycleEntity } from '../../profile/lookup-tables/entities/lookup-biling-cycle.entity';

@Entity('subscription')
export class SubscriptionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  planId: string;

  @Column({ type: 'uuid' })
  billingCycleId: string;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'varchar' })
  status: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity;

  @ManyToOne(() => LookUpBillingCycleEntity)
  @JoinColumn({ name: 'billing_cycle_id' })
  billingCycle: LookUpBillingCycleEntity;
}
