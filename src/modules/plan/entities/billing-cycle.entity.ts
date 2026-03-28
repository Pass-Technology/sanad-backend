import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { PlanPriceEntity } from "./plan-price.entity";
import { LookUpProviderTypeEntity } from "../../profile/lookup-tables/entities/lookup-provider-type.entity";

@Entity('billing_cycles')
export class BillingCycleEntity extends BaseEntity {

    @Column()
    labelEn: string;

    @Column({ nullable: true })
    labelAr: string;

    @Column()
    months: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    discountPercentage: number;

    @Column({ type: 'varchar', nullable: true })
    badgeEn: string | null;

    @Column({ type: 'varchar', nullable: true })
    badgeAr: string | null;

    @Column({ type: 'varchar', nullable: false })
    staticCode: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => PlanPriceEntity, (planPrice) => planPrice.billingCycle)
    prices: PlanPriceEntity[];

    @ManyToMany(() => LookUpProviderTypeEntity, (pt) => pt.billingCycles)
    @JoinTable()
    providerTypes: LookUpProviderTypeEntity[];
}
