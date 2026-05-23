import { Entity, Column } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_currencies')
export class LookupCurrencyEntity extends LookupBaseEntity {
    @Column({ type: 'varchar', nullable: true })
    symbol: string;

    @Column({ type: 'varchar', nullable: true })
    emoji: string;
}
