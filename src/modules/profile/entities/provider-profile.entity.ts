import {
    Entity,
    Column,
    OneToOne,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderUserInfoEntity } from './provider-user-info.entity';
import { BranchEntity } from './branch.entity';
import { ProviderComplianceEntity } from './provider-compliance.entity';
import { ProviderPaymentEntity } from './provider-payment.entity';
import { ProviderSubscriptionEntity } from './provider-subscription.entity';
import { LookUpProfileStatusEntity } from '../lookup-tables/entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from '../lookup-tables/entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from '../lookup-tables/entities/lookup-company-type.entity';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('provider_profiles')
export class ProviderProfileEntity extends BaseEntity {
    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'uuid' })
    statusId: string;

    @ManyToOne(() => LookUpProfileStatusEntity, { onDelete: 'CASCADE' })
    status: LookUpProfileStatusEntity;

    @Column({ type: 'uuid', nullable: true })
    providerTypeId: string | null;

    @ManyToOne(() => LookUpProviderTypeEntity, { onDelete: 'CASCADE' })
    providerType: LookUpProviderTypeEntity | null;

    @Column({ type: 'uuid', nullable: true })
    companyTypeId: string | null;

    @ManyToOne(() => LookUpCompanyTypeEntity, { onDelete: 'CASCADE' })
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

    @Column('simple-array', { nullable: true })
    languagesSpoken: string[] | null;

    @Column('simple-array', { nullable: true })
    selectedServiceIds: string[];


    @Column({ type: 'int', default: 1 })
    currentStep: number;

    @OneToOne(() => ProviderUserInfoEntity, (info) => info.providerProfile, {
        // eager: true,
    })
    userInfo: ProviderUserInfoEntity;

    @OneToMany(() => BranchEntity, (branch) => branch.providerProfile, {
        onDelete: 'CASCADE',
        // eager: true,
    })
    branches: BranchEntity[];

    @OneToOne(() => ProviderComplianceEntity, (c) => c.providerProfile, {
        onDelete: 'CASCADE',
        // eager: true,
    })
    compliance: ProviderComplianceEntity;

    @OneToOne(() => ProviderPaymentEntity, (p) => p.providerProfile, {
        onDelete: 'CASCADE',
        // eager: true,
    })
    payment: ProviderPaymentEntity;

    @OneToOne(() => ProviderSubscriptionEntity, (s) => s.providerProfile, {
        onDelete: 'CASCADE',
        // eager: true,
    })
    subscription: ProviderSubscriptionEntity;

    @ManyToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
    user: UserEntity;

}
