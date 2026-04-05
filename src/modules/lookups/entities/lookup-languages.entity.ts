import { Entity, ManyToMany, Column } from "typeorm";
import { ProviderProfileEntity } from "../../profile/entities/provider-profile.entity";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_languages')
export class LookupLanguagesEntity extends LookupBaseEntity {
    @Column()
    flag: string;

    @ManyToMany(() => ProviderProfileEntity, (profile) => profile.languages)
    profiles: ProviderProfileEntity[];
}