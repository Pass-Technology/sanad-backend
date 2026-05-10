import { Entity, OneToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { OrderEntity } from '../../orders/entities/order.entity';
import { ClientAddressEntity } from './client-address.entity';
import { ClientPaymentMethodEntity } from './client-payment-method.entity';
import { ClientCouponEntity } from '../../promotions/entities/client-coupon.entity';


@Entity('client_profiles')
export class ClientProfileEntity extends BaseEntity {
    @Column({ nullable: true })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    walletBalance: number;

    @OneToOne(() => UserEntity, (user) => user.clientProfile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity;

    @OneToMany(() => OrderEntity, (order) => order.client)
    orders: OrderEntity[];

    @OneToMany(() => ClientAddressEntity, (address) => address.client)
    addresses: ClientAddressEntity[];

    @OneToMany(() => ClientPaymentMethodEntity, (paymentMethod) => paymentMethod.client)
    paymentMethods: ClientPaymentMethodEntity[];

    @OneToMany(() => ClientCouponEntity, (coupon) => coupon.client)
    coupons: ClientCouponEntity[];
}