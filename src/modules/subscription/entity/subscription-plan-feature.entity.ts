import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { SubscriptionPlanEntity } from "./subscription-plan.entity";
import { BaseEntity } from '../../../shared/base-entity';


@Entity('subscription_plan_features')
@Unique(['planId', 'featureText'])
export class SubscriptionPlanFeatureEntity extends BaseEntity {

    @Column({ type: 'varchar' })
    planId: string;

    @ManyToOne(() => SubscriptionPlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'planId' })
    plan: SubscriptionPlanEntity;

    @Column()
    featureText: string;

    @Column({ default: 0 })
    displayOrder: number;
}