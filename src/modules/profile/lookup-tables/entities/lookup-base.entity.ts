import { BaseEntity } from "../../../../database/base-entity";
import { Column } from "typeorm";

export abstract class LookupBaseEntity extends BaseEntity {

    @Column({ type: 'varchar' })
    labelEn: string;

    @Column({ type: 'varchar' })
    labelAr: string;

    @Column({ type: 'varchar', nullable: true })
    staticCode: string;
}