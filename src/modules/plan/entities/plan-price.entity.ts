import { BaseEntity } from "src/database/base-entity";
import { Column, Entity } from "typeorm";

@Entity('plan_prices')
export class PlanPriceEntity extends BaseEntity {

    @Column()
    planId: string;

    @Column()
    billingCycleId: string;

    @Column()
    price: number;

}