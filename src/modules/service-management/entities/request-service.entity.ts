import { BaseEntity } from "../../../database/base-entity";
import { UserEntity } from "../../../modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CategoryEntity } from "./category.entity";

@Entity('request_services')
export class RequestServiceEntity extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @ManyToOne(() => CategoryEntity)
    @JoinColumn({ name: 'category_id' })
    category?: CategoryEntity;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}