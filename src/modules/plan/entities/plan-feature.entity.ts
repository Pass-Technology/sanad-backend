import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { PlanCycleEntity } from './plan-cycle.entity';
import { FeatureEntity } from './feature.entity';

@Entity('plan_feature')
export class PlanFeatureEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  planId: string;

  @Column({ type: 'uuid' })
  featureId: string;

  @Column({ type: 'varchar', nullable: true })
  value: string | null;

  @Column({ type: 'boolean', default: true })
  isIncluded: boolean;

  @ManyToOne(() => PlanCycleEntity, (plan) => plan.features)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanCycleEntity;

  @ManyToOne(() => FeatureEntity, (feature) => feature.planFeatures)
  @JoinColumn({ name: 'feature_id' })
  feature: FeatureEntity;
}
