import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { PlanFeatureEntity } from './plan-feature.entity';

@Entity('feature')
export class FeatureEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => PlanFeatureEntity, (planFeature) => planFeature.feature)
  planFeatures: PlanFeatureEntity[];
}
