import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderPaymentEntity } from './provider-payment.entity';

@Entity('bank_accounts')
export class BankAccountEntity extends BaseEntity {
    @Exclude()
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.bankAccounts, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column()
    bankName: string;

    @Column()
    accountHolderName: string;

    @Column({ nullable: true })
    accountNumber: string;

    @Column()
    iban: string;

    @Column({ nullable: true })
    swiftCode: string;
}
