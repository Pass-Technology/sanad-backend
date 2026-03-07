import { Entity } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_company_type')
export class LookUpCompanyType extends LookupBaseEntity { }