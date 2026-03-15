import { BaseEntity } from "src/database/base-entity";
import { Column, Entity } from "typeorm";

@Entity('billing_cycles')
export class BillingCycleEntity extends BaseEntity {

    @Column()
    label: string;

    @Column()
    mounths: string;

    @Column()
    discountPercentage: number;
}