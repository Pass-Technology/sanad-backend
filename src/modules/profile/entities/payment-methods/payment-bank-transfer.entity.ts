import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../database/base-entity';
import { ProviderPaymentEntity } from '../provider-payment.entity';

@Entity('payment_bank_transfer')
export class PaymentBankTransferEntity extends BaseEntity {
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.bankTransfer, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @Column()
    bankName: string;

    @Column()
    accountHolderName: string;

    @Column({ nullable: true })
    accountNumber: string;

    @Column()
    iban: string;
}
