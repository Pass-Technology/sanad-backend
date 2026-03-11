import { Entity, Column, OneToMany, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { SubscriptionPlanFeatureEntity } from "./subscription-plan-feature.entity";

@Entity('subscription_plans')
export class SubscriptionPlanEntity {

    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column()
    name: string;

    @Column({ type: 'decimal' })
    monthlyPrice: number;

    @Column({ type: 'int', nullable: true })
    bookingLimit: number | null;

    @Column({ type: 'decimal', nullable: true })
    commissionPercent: number | null;

    @Column({ default: false })
    isMostPopular: boolean;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => SubscriptionPlanFeatureEntity, feature => feature.plan)
    features: SubscriptionPlanFeatureEntity[];
}