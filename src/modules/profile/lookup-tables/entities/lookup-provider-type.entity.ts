import { Entity, OneToMany } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";
import { ProviderProfileEntity } from "../../entities/provider-profile.entity";
import { BillingCycleEntity } from "../../../plan/entities/billing-cycle.entity";

@Entity('lookup_provider_type')
export class LookUpProviderTypeEntity extends LookupBaseEntity {
    @OneToMany(() => ProviderProfileEntity, (profile) => profile.providerType)
    profiles: ProviderProfileEntity[];

    @OneToMany(() => BillingCycleEntity, (billingCycle) => billingCycle.providerType)
    billingCycles: BillingCycleEntity[];
}
