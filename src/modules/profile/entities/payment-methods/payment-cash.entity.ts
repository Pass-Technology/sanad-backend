import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../database/base-entity';
import { ProviderPaymentEntity } from '../provider-payment.entity';

@Entity('payment_cash')
export class PaymentCashEntity extends BaseEntity {
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.cash, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @Column({ type: 'text', nullable: true })
    notes: string;
}
