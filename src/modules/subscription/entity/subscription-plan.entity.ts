import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { SubscriptionPlanFeatureEntity } from "./subscription-plan-feature.entity";
import { ProviderSubscriptionEntity } from "../../profile/entities/provider-subscription.entity";

@Entity('subscription_plans')
export class SubscriptionPlanEntity {

    @PrimaryGeneratedColumn('uuid')
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

    @OneToMany(() => ProviderSubscriptionEntity, sub => sub.selectedPlan)
    subscriptions: ProviderSubscriptionEntity[];
}