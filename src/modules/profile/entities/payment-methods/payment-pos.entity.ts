import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../database/base-entity';
import { ProviderPaymentEntity } from '../provider-payment.entity';

@Entity('payment_pos')
export class PaymentPosEntity extends BaseEntity {
    @ManyToOne(() => ProviderPaymentEntity, (p) => p.pos, { onDelete: 'CASCADE' })
    @JoinColumn()
    providerPayment: ProviderPaymentEntity;

    @Column({ default: false })
    isAvailable: boolean;

    @Column({ nullable: false })
    providerName: string;

    @Column({ nullable: true })
    deviceId: string;

    @Column('simple-array', { nullable: true })
    supportedCards: string[];
}
