import { Entity, OneToMany } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";
import { ProviderProfileEntity } from "../../entities/provider-profile.entity";

@Entity('lookup_profile_status')
export class LookUpProfileStatusEntity extends LookupBaseEntity {
    @OneToMany(() => ProviderProfileEntity, (profile) => profile.status)
    profiles: ProviderProfileEntity[];
}
