import { Entity } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_provider_type')
export class LookUpProviderType extends LookupBaseEntity { }
