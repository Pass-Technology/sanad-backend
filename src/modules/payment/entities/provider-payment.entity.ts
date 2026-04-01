import {
    Entity,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfileEntity } from '../../profile/entities/provider-profile.entity';
import { BaseEntity } from '../../../database/base-entity';
import { Exclude } from 'class-transformer';
import { BankAccountEntity } from './bank-account.entity';
import { PaymentBankTransferEntity } from './payment-bank-transfer.entity';
import { PaymentCashEntity } from './payment-cash.entity';
import { PaymentChequeEntity } from './payment-cheque.entity';
import { PaymentLinkEntity } from './payment-link.entity';
import { PaymentPosEntity } from './payment-pos.entity';
import { PaymentSanadEntity } from './payment-sanad.entity';

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
