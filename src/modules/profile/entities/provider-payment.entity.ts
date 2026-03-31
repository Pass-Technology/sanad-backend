import {
    Entity,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfileEntity } from './provider-profile.entity';
import { BaseEntity } from '../../../database/base-entity';
import { PaymentCashEntity } from './payment-methods/payment-cash.entity';
import { PaymentBankTransferEntity } from './payment-methods/payment-bank-transfer.entity';
import { PaymentLinkEntity } from './payment-methods/payment-link.entity';
import { PaymentSanadEntity } from './payment-methods/payment-sanad.entity';
import { PaymentPosEntity } from './payment-methods/payment-pos.entity';
import { PaymentChequeEntity } from './payment-methods/payment-cheque.entity';
import { BankAccountEntity } from './payment-methods/bank-account.entity';
import { Exclude } from 'class-transformer';

@Entity('provider_payments')
export class ProviderPaymentEntity extends BaseEntity {

    @Exclude()
    @OneToOne(() => ProviderProfileEntity, (profile) => profile.payment, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    providerProfile: ProviderProfileEntity;


    // SHARED BANK ACCOUNTS

    @OneToMany(() => BankAccountEntity, (ba) => ba.providerPayment, { cascade: true })
    bankAccounts: BankAccountEntity[];


    // NESTED PAYMENT METHODS

    @OneToOne(() => PaymentCashEntity, (c) => c.providerPayment, { cascade: true })
    cash: PaymentCashEntity;

    @OneToMany(() => PaymentBankTransferEntity, (bt) => bt.providerPayment, { cascade: true })
    bankTransfer: PaymentBankTransferEntity[];

    @OneToMany(() => PaymentLinkEntity, (pl) => pl.providerPayment, { cascade: true })
    paymentLink: PaymentLinkEntity[];

    @OneToMany(() => PaymentSanadEntity, (s) => s.providerPayment, { cascade: true })
    sanad: PaymentSanadEntity[];

    @OneToMany(() => PaymentPosEntity, (pos) => pos.providerPayment, { cascade: true })
    pos: PaymentPosEntity[];

    @OneToOne(() => PaymentChequeEntity, (ch) => ch.providerPayment, { cascade: true })
    cheque: PaymentChequeEntity;
}
