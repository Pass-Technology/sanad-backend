import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfileEntity } from './provider-profile.entity';
import { BaseEntity } from '../../../database/base-entity';

@Entity('provider_payments')
export class ProviderPaymentEntity extends BaseEntity {

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.payment, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfileEntity;

    @Column()
    bankName: string;

    @Column()
    accountHolderName: string;

    @Column()
    accountNumber: string;

    @Column()
    iban: string;

    @Column('simple-array')
    paymentMethodIds: string[];


}
