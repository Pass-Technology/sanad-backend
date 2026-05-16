import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from './client-profile.entity';
import { PaymentMethod } from '../../marketplace/enums/payment-method.enum';

@Entity('client_payment_methods')
export class ClientPaymentMethodEntity extends BaseEntity {
    @Column({
        type: 'enum',
        enum: PaymentMethod,
    })
    type: PaymentMethod;

    @Column({ nullable: true })
    provider: string; // e.g Visa/Mastercard

    @Column({ nullable: true })
    lastFour: string;

    @Column({ default: false })
    isDefault: boolean;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @ManyToOne(() => ClientProfileEntity, (client) => client.paymentMethods, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;
}
