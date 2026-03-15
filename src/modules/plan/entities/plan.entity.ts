import { BaseEntity } from "src/database/base-entity";
import { Column, Entity } from "typeorm";

@Entity('plans')
export class PlanEntity extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description: string;

    // @Column()
    // price: number;
}