import {
    Entity,
    Column,
    OneToOne,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ProviderUserInfo } from './provider-user-info.entity';
import { Branch } from './branch.entity';
import { ProviderCompliance } from './provider-compliance.entity';
import { ProviderPayment } from './provider-payment.entity';
import { ProviderSubscription } from './provider-subscription.entity';
import { LookUpProfileStatus } from '../../lookup/entities/lookup-profile-status.entity';
import { LookUpProviderType } from '../../lookup/entities/lookup-provider-type.entity';
import { LookUpCompanyType } from '../../lookup/entities/lookup-company-type.entity';
import { BaseEntity } from '../../shared/base-entity';
import { User } from '../../user/entities/user.entity';

@Entity('provider_profiles')
export class ProviderProfile extends BaseEntity {
    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'varchar', default: 'draft' })
    statusId: string;

    @ManyToOne(() => LookUpProfileStatus, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'statusId' })
    status: LookUpProfileStatus;

    @Column({ type: 'varchar', nullable: true })
    providerTypeId: string | null;

    @ManyToOne(() => LookUpProviderType, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'providerTypeId' })
    providerType: LookUpProviderType | null;

    @Column({ type: 'varchar', nullable: true })
    companyTypeId: string | null;

    @ManyToOne(() => LookUpCompanyType, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyTypeId' })
    companyType: LookUpCompanyType | null;

    @Column({ type: 'varchar', nullable: true })
    tradeName: string;

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

    @OneToOne(() => ProviderUserInfo, (info) => info.providerProfile, {
        eager: true,
    })
    userInfo: ProviderUserInfo;

    @OneToMany(() => Branch, (branch) => branch.providerProfile, {
        onDelete: 'CASCADE',
        eager: true,
    })
    branches: Branch[];

    @OneToOne(() => ProviderCompliance, (c) => c.providerProfile, {
        onDelete: 'CASCADE',
        eager: true,
    })
    compliance: ProviderCompliance;

    @OneToOne(() => ProviderPayment, (p) => p.providerProfile, {
        onDelete: 'CASCADE',
        eager: true,
    })
    payment: ProviderPayment;

    @OneToOne(() => ProviderSubscription, (s) => s.providerProfile, {
        onDelete: 'CASCADE',
        eager: true,
    })
    subscription: ProviderSubscription;

    @ManyToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

}
