import { Column, PrimaryColumn } from "typeorm";

export abstract class LookupBaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'varchar' })
    labelEn: string;

    @Column({ type: 'varchar' })
    labelAr: string;
}