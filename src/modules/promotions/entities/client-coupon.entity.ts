import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';

@Entity('client_coupons')
export class ClientCouponEntity extends BaseEntity {
    @Column({ unique: true })
    code: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    @Column({
        type: 'enum',
        enum: ['PERCENTAGE', 'FIXED'],
        default: 'PERCENTAGE'
    })
    discountType: string;

    @Column({ type: 'timestamp' })
    expiryDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => ClientProfileEntity, (client) => client.coupons, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;
}
