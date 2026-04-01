import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderPaymentEntity } from './provider-payment.entity';

@Entity('payment_pos')
export class PaymentPosEntity extends BaseEntity {
    @Exclude()
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.pos, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @Column({ nullable: false })
    providerName: string;

    @Column({ nullable: true })
    deviceId: string;

    @Column('simple-array', { nullable: true })
    supportedCards: string[];
}
