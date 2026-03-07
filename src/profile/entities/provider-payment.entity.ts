import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderProfile } from './provider-profile.entity';
import { BaseEntity } from '../../shared/base-entity';

@Entity('provider_payments')
export class ProviderPayment extends BaseEntity {

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @OneToOne(() => ProviderProfile, (profile) => profile.payment, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfile;

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
