import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, OneToMany } from "typeorm";
import { PlanPriceEntity } from "./plan-price.entity";
import { PlanFeatureEntity } from "./plan-feature.entity";

@Entity('plans')
export class PlanEntity extends BaseEntity {

    @Column()
    nameEn: string;

    @Column({ nullable: true })
    nameAr: string;

    @Column()
    descriptionEn: string;

    @Column({ nullable: true })
    descriptionAr: string;

    @Column({ type: 'varchar', nullable: true })
    tagEn: string | null;

    @Column({ type: 'varchar', nullable: true })
    tagAr: string | null;

    @Column({ default: true })
    isActive: boolean;



    @OneToMany(() => PlanPriceEntity, (planPrice) => planPrice.plan)
    prices: PlanPriceEntity[];

    @OneToMany(() => PlanFeatureEntity, (planFeature) => planFeature.plan)
    features: PlanFeatureEntity[];
}