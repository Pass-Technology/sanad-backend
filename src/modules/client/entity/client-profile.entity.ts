import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('client_profiles')
export class ClientProfileEntity extends BaseEntity {
    @OneToOne(() => UserEntity, (user) => user.clientProfile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity;



}