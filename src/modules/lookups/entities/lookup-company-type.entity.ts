import { Entity, OneToMany } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";
import { ProviderProfileEntity } from "../../profile/entities/provider-profile.entity";

@Entity('lookup_company_type')
export class LookUpCompanyTypeEntity extends LookupBaseEntity {
    @OneToMany(() => ProviderProfileEntity, (profile) => profile.companyType)
    profiles: ProviderProfileEntity[];
}