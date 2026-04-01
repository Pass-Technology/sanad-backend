import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderPaymentEntity } from './provider-payment.entity';

@Entity('payment_cheque')
export class PaymentChequeEntity extends BaseEntity {
    @Exclude()
    @OneToOne(() => ProviderPaymentEntity, (p) => p.cheque, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @Column({ nullable: false })
    bankName: string;

    @Column({ nullable: false })
    payeeName: string;
}
