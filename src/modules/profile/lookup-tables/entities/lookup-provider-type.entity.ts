import { Entity, OneToMany } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";
import { ProviderProfileEntity } from "../../entities/provider-profile.entity";

@Entity('lookup_provider_type')
export class LookUpProviderTypeEntity extends LookupBaseEntity {
    @OneToMany(() => ProviderProfileEntity, (profile) => profile.providerType)
    profiles: ProviderProfileEntity[];
}
