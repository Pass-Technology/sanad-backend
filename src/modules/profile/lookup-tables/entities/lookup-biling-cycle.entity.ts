import { Entity } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_billing_cycle')
export class LookUpBillingCycleEntity extends LookupBaseEntity { }
