import { Entity, Column } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_nationalities')
export class LookupNationalityEntity extends LookupBaseEntity {
    @Column({ nullable: true })
    flag: string;
}
