import { Column, PrimaryColumn } from "typeorm";

export abstract class LookupBaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'varchar' })
    label: string;
}