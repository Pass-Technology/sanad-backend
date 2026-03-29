import {
    Entity,
    Column,
    OneToOne,
    OneToMany,
    ManyToOne,
    JoinColumn,
    JoinTable,
    ManyToMany,
} from 'typeorm';
import { ProviderUserInfoEntity } from './provider-user-info.entity';
import { BranchEntity } from './branch.entity';
import { ProviderComplianceEntity } from './provider-compliance.entity';
import { ProviderPaymentEntity } from './provider-payment.entity';
import { LookUpProfileStatusEntity } from '../lookup-tables/entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from '../lookup-tables/entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from '../lookup-tables/entities/lookup-company-type.entity';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ServiceEntity } from '../../service-management/entities/service.entity';
import { LookupLanguagesEntity } from '../lookup-tables/entities/lookup-languages.entity';

@Entity('provider_profiles')
export class ProviderProfileEntity extends BaseEntity {

    @ManyToOne(() => LookUpProfileStatusEntity, { cascade: true, onDelete: 'RESTRICT' })
    @JoinColumn()
    status: LookUpProfileStatusEntity;


    @ManyToOne(() => LookUpProviderTypeEntity, {
        nullable: true,
        cascade: true,
        onDelete: 'RESTRICT'
    })
    @JoinColumn()
    providerType: LookUpProviderTypeEntity;


    @ManyToOne(() => LookUpCompanyTypeEntity, { cascade: true, nullable: true, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'companyTypeId' })
    companyType: LookUpCompanyTypeEntity | null;

    @Column({ type: 'varchar', nullable: true })
    tradeName: string | null;

    @Column({ type: 'varchar', nullable: true })
    companyRepresentativeName: string | null;

    @Column({ type: 'text', nullable: true })
    companyDescription: string | null;

    @Column({ type: 'varchar', nullable: true })
    socialMediaLink: string | null;

    @Column({ type: 'varchar', nullable: true })
    websiteLink: string | null;


    @ManyToMany(() => ServiceEntity, (service) => service.profiles)
    @JoinTable({
        name: 'provider_profile_services',
        joinColumn: { name: 'profile_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' }
    })
    selectedServices: ServiceEntity[];


    @OneToOne(() => ProviderUserInfoEntity, (info) => info.providerProfile, {
        cascade: true
    })
    userInfo: ProviderUserInfoEntity;

    @OneToMany(() => BranchEntity, (branch) => branch.providerProfile, {
        onDelete: 'CASCADE',
        cascade: true
    })
    branches: BranchEntity[];

    @OneToOne(() => ProviderComplianceEntity, (c) => c.providerProfile, {
        onDelete: 'CASCADE',
        cascade: true
    })
    compliance: ProviderComplianceEntity;

    // what is payment? 
    // if its how the provider will pay for the subscription plan
    // then it should be in the user entity
    // if its how the provider will receive payments from customers
    // then it should be in the provider profile entity and should be one to many relation as the provider will 
    // provide payment channels to customers 
    @OneToOne(() => ProviderPaymentEntity, (p) => p.providerProfile, {
        onDelete: 'CASCADE',
        cascade: true
    })
    payment: ProviderPaymentEntity;

    @ManyToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity;

    @ManyToMany(() => LookupLanguagesEntity, (lang) => lang.profiles)
    @JoinTable({
        name: 'provider_profile_languages',
        joinColumn: { name: 'profile_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'language_id', referencedColumnName: 'id' }
    })
    languages: LookupLanguagesEntity[];
}
