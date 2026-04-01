import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderPaymentEntity } from './provider-payment.entity';
import { BankAccountEntity } from './bank-account.entity';

@Entity('payment_bank_transfer')
export class PaymentBankTransferEntity extends BaseEntity {
    @Exclude()
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.bankTransfer)
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @ManyToOne(() => BankAccountEntity, { cascade: true })
    @JoinColumn({ name: 'bank_account_id' })
    bankAccount: BankAccountEntity;
}
