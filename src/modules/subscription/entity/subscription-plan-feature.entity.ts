import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { SubscriptionPlanEntity } from "./subscription-plan.entity";
import { BaseEntity } from '../../../database/base-entity';


@Entity('subscription_plan_features')
@Unique(['plan', 'featureText'])
export class SubscriptionPlanFeatureEntity extends BaseEntity {

    @ManyToOne(() => SubscriptionPlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    plan: SubscriptionPlanEntity;

    @Column()
    featureText: string;

    @Column({ default: 0 })
    displayOrder: number;
}