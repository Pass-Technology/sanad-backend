import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../database/base-entity';
import { ProviderPaymentEntity } from '../provider-payment.entity';

@Entity('payment_cheque')
export class PaymentChequeEntity extends BaseEntity {
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.cheque, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @Column({ nullable: false })
    bankName: string;

    @Column({ nullable: false })
    payeeName: string;
}
