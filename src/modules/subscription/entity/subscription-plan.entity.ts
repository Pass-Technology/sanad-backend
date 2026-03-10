import { Entity, Column } from "typeorm";
import { BaseEntity } from '../../../shared/base-entity';

@Entity('subscription_plans')
export class SubscriptionPlanEntity extends BaseEntity {

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
}