import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../database/base-entity';
import { ProviderPaymentEntity } from '../provider-payment.entity';

@Entity('payment_link')
export class PaymentLinkEntity extends BaseEntity {
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.paymentLink, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isEnabled: boolean;

    @Column({ nullable: false })
    providerName: string;

    @Column({ nullable: false })
    accountEmailOrMerchantId: string;

    @Column({ nullable: true })
    apiKey: string;

    @Column({ nullable: true })
    callbackUrl: string;
}
