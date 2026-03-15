import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { PlanEntity } from './plan.entity';
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

  @ManyToOne(() => PlanEntity, (plan) => plan.features)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity;

  @ManyToOne(() => FeatureEntity, (feature) => feature.planFeatures)
  @JoinColumn({ name: 'feature_id' })
  feature: FeatureEntity;
}
