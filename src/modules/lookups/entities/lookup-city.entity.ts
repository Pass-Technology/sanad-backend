import { Entity } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_cities')
export class LookupCityEntity extends LookupBaseEntity {
}
