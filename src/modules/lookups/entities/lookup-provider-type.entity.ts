import { Entity, ManyToMany, OneToMany } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";
import { ProviderProfileEntity } from "../../profile/entities/provider-profile.entity";
import { BillingCycleEntity } from "../../plan/entities/billing-cycle.entity";
import { PlanEntity } from "../../plan/entities/plan.entity";

@Entity('lookup_provider_type')
export class LookUpProviderTypeEntity extends LookupBaseEntity {
    @OneToMany(() => ProviderProfileEntity, (profile) => profile.providerType)
    profiles: ProviderProfileEntity[];

    @ManyToMany(() => BillingCycleEntity, (bc) => bc.providerTypes)
    billingCycles: BillingCycleEntity[];

    @OneToMany(() => PlanEntity, (plan) => plan.providerType)
    plans: PlanEntity[];
}
