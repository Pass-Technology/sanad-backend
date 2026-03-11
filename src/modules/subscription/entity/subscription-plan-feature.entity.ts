import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { SubscriptionPlanEntity } from "./subscription-plan.entity";
import { BaseEntity } from '../../../database/base-entity';


@Entity('subscription_plan_features')
@Unique(['planId', 'featureText'])
export class SubscriptionPlanFeatureEntity extends BaseEntity {

    @Column({ type: 'uuid' })
    planId: string;

    @ManyToOne(() => SubscriptionPlanEntity, { onDelete: 'CASCADE' })
    plan: SubscriptionPlanEntity;

    @Column()
    featureText: string;

    @Column({ default: 0 })
    displayOrder: number;
}