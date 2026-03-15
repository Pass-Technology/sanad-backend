import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { PlanFeatureEntity } from './plan-feature.entity';
import { PlanPriceEntity } from './plan-price.entity';

@Entity('plan_cycle')
export class PlanCycleEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @Column({ type: 'boolean', default: false })
  isPopular: boolean;

  @Column({ type: 'boolean', default: false })
  isCustomized: boolean;

  @OneToMany(() => PlanFeatureEntity, (planFeature) => planFeature.plan)
  features: PlanFeatureEntity[];

  @OneToMany(() => PlanPriceEntity, (planPrice) => planPrice.plan)
  prices: PlanPriceEntity[];
}
