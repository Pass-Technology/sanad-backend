import { ProviderProfileEntity } from "../../../modules/profile/entities/provider-profile.entity";
import { BaseEntity } from "../../../database/base-entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BasicInfo, CustomerProfile, Operations, PurchasingBehavior, Services, Strategy } from "../types/target-audience-profile-sections.types";

@Entity('target-audience-profiles')
export class TargetAudienceProfile extends BaseEntity {
    @OneToOne(() => ProviderProfileEntity)
    @JoinColumn()
    providerProfile: ProviderProfileEntity;

    @Column({ type: "jsonb", default: {} })
    basicInfo: BasicInfo;

    @Column({ type: "jsonb", default: {} })
    services: Services;

    @Column({ type: "jsonb", default: {} })
    operations: Operations;

    @Column({ type: "jsonb", default: {} })
    customer: CustomerProfile;

    @Column({ type: "jsonb", default: {} })
    purchasing: PurchasingBehavior;

    @Column({ type: "jsonb", default: {} })
    strategy: Strategy;

}