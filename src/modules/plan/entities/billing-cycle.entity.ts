import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, OneToMany } from "typeorm";
import { PlanPriceEntity } from "./plan-price.entity";

@Entity('billing_cycles')
export class BillingCycleEntity extends BaseEntity {

    @Column()
    labelEn: string;

    @Column({ nullable: true })
    labelAr: string;

    @Column()
    months: number;

    @Column()
    discountPercentage: number;

    @Column({ type: 'varchar', nullable: true })
    badgeEn: string | null;

    @Column({ type: 'varchar', nullable: true })
    badgeAr: string | null;

    @Column({ type: 'varchar', nullable: false })
    staticCode: string;

    @Column({ default: 0 })
    displayOrder: number;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => PlanPriceEntity, (planPrice) => planPrice.billingCycle)
    prices: PlanPriceEntity[];
}
