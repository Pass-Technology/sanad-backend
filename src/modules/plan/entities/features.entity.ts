import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, OneToMany } from "typeorm";
import { PlanFeatureEntity } from "./plan-feature.entity";

@Entity('features')
export class FeatureEntity extends BaseEntity {

    @Column()
    nameEn: string;

    @Column({ nullable: true })
    nameAr: string;

    @Column({ nullable: true })
    descriptionEn: string;

    @Column({ nullable: true })
    descriptionAr: string;


    @OneToMany(() => PlanFeatureEntity, (planFeature) => planFeature.feature)
    planFeatures: PlanFeatureEntity[];
}