import { BaseEntity } from "../../../database/base-entity";
import { UserEntity } from "../../../modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('request_services')
export class RequestServiceEntity extends BaseEntity {
    @Column({ nullable: true })
    nameAr?: string;

    @Column({ nullable: true })
    nameEn?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => UserEntity, (user) => user.requestServices)
    user: UserEntity;
}