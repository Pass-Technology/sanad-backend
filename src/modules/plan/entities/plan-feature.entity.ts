import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PlanEntity } from "./plan.entity";

@Entity('plan_features')
export class PlanFeatureEntity extends BaseEntity {
    @Column({ nullable: true }) // Made nullable to fix migration error with existing data
    nameEn: string;

    @Column({ nullable: true })
    nameAr: string;

    @Column({ nullable: true })
    descriptionEn: string;

    @Column({ nullable: true })
    descriptionAr: string;

    @Column({ nullable: true })
    valueEn: string;

    @Column({ nullable: true })
    valueAr: string;

    @Column({ default: 0 })
    displayOrder: number;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => PlanEntity, (plan) => plan.features)
    @JoinColumn({ name: 'plan_id' })
    plan: PlanEntity;
}