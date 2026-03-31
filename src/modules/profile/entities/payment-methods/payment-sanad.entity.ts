import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../database/base-entity';
import { ProviderPaymentEntity } from '../provider-payment.entity';

@Entity('payment_sanad')
export class PaymentSanadEntity extends BaseEntity {
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.sanad, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @Column()
    settlementPreference: string;

    @Column()
    bankName: string;

    @Column()
    accountHolderName: string;

    @Column({ nullable: true })
    accountNumber: string;

    @Column()
    iban: string;
}
