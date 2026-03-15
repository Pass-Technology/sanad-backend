import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, OneToMany } from "typeorm";
import { PlanPriceEntity } from "../../plan/entities/plan-price.entity";

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


    @OneToMany(() => PlanPriceEntity, (planPrice) => planPrice.billingCycle)
    prices: PlanPriceEntity[];
}