import { Entity, Column } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_payment')
export class LookUpPaymentEntity extends LookupBaseEntity {
    @Column({ type: 'varchar', nullable: false })
    category: string;
}
