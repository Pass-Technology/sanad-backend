import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { BankAccountEntity } from '../../payment/entities/bank-account.entity';
import { PayoutStatus } from '../enums/payout-status.enum';

@Entity('payouts')
export class PayoutEntity extends BaseEntity {
    @ManyToOne(() => ProviderProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: PayoutStatus,
        default: PayoutStatus.PENDING,
    })
    status: PayoutStatus;

    @Column({ type: 'varchar', default: 'Bank Transfer' })
    method: string;

    @ManyToOne(() => BankAccountEntity, { nullable: true })
    @JoinColumn({ name: 'bank_account_id' })
    bankAccount: BankAccountEntity;

    @Column({ type: 'varchar', nullable: true })
    reference: string;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;
}
