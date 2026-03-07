import { Entity } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_profile_status')
export class LookUpProfileStatus extends LookupBaseEntity { }
