import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderPaymentEntity } from './provider-payment.entity';
import { BankAccountEntity } from './bank-account.entity';

@Entity('payment_sanad')
export class PaymentSanadEntity extends BaseEntity {
    @Exclude()
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.sanad, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @Column()
    settlementPreference: string;

    @Column({ default: false })
    isUsingBankTransferData: boolean;

    @ManyToOne(() => BankAccountEntity, { cascade: true })
    @JoinColumn({ name: 'bank_account_id' })
    bankAccount: BankAccountEntity;
}
