import { Entity, Column } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_units')
export class LookupUnitEntity extends LookupBaseEntity {

}
