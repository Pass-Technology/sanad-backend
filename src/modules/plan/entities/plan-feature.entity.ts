import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PlanEntity } from "./plan.entity";
import { FeatureEntity } from "./features.entity";

@Entity('plan_features')
export class PlanFeatureEntity extends BaseEntity {

    @Column({ nullable: true })
    value: string;

    @ManyToOne(() => PlanEntity, (plan) => plan.features)
    @JoinColumn({ name: 'plan_id' })
    plan: PlanEntity;

    @ManyToOne(() => FeatureEntity, (feature) => feature.planFeatures)
    @JoinColumn({ name: 'feature_id' })
    feature: FeatureEntity;
}