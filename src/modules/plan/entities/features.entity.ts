import { BaseEntity } from "src/database/base-entity";
import { Column, Entity } from "typeorm";

@Entity('features')
export class FeatureEntity extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description: string;

}