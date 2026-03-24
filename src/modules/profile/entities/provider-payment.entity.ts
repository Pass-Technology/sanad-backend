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

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.payment, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    providerProfile: ProviderProfileEntity;

    @Column()
    bankName: string;

    @Column()
    accountHolderName: string;

    @Column()
    accountNumber: string;

    @Column()
    iban: string;

    // what is payment methods?
    // if its how the provider will receive payments from customers
    // then it should be in the provider profile entity and should be one to many relation as the provider will 
    // provide payment channels to customers 
    // should be a separate entity not just an array? 

    @Column('simple-array')
    paymentMethodIds: string[];


}
