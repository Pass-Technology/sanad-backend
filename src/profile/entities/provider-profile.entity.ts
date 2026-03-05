import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { ProviderType, CompanyType, ProfileStatus } from '../enums/profile-status.enum';
import { ProviderUserInfo } from './provider-user-info.entity';
import { Branch } from './branch.entity';
import { ProviderCompliance } from './provider-compliance.entity';
import { ProviderPayment } from './provider-payment.entity';
import { ProviderSubscription } from './provider-subscription.entity';

@Entity('provider_profiles')
export class ProviderProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'enum', enum: ProviderType, nullable: true, default: null })
    providerType: ProviderType;

    @Column({ type: 'enum', enum: CompanyType, nullable: true, default: null })
    companyType: CompanyType | null;

    @Column({ nullable: true, default: null })
    tradeName: string;

    @Column({ nullable: true, default: null })
    companyRepresentativeName: string | null;

    @Column({ type: 'text', nullable: true, default: null })
    companyDescription: string | null;

    @Column({ nullable: true, default: null })
    socialMediaLink: string | null;

    @Column({ nullable: true, default: null })
    websiteLink: string | null;

    @Column('simple-array', { nullable: true, default: null })
    languagesSpoken: string[] | null;

    @Column('simple-array', { nullable: true, default: null })
    selectedServiceIds: string[];

    @Column({
        type: 'enum',
        enum: ProfileStatus,
        default: ProfileStatus.DRAFT,
    })
    status: ProfileStatus;

    @Column({ type: 'int', default: 1 })
    currentStep: number;

    @OneToOne(() => ProviderUserInfo, (info) => info.providerProfile, {
        cascade: true,
        eager: true,
    })
    userInfo: ProviderUserInfo;

    @OneToMany(() => Branch, (branch) => branch.providerProfile, {
        cascade: true,
        eager: true,
    })
    branches: Branch[];

    @OneToOne(() => ProviderCompliance, (c) => c.providerProfile, {
        cascade: true,
        eager: true,
    })
    compliance: ProviderCompliance;

    @OneToOne(() => ProviderPayment, (p) => p.providerProfile, {
        cascade: true,
        eager: true,
    })
    payment: ProviderPayment;

    @OneToOne(() => ProviderSubscription, (s) => s.providerProfile, {
        cascade: true,
        eager: true,
    })
    subscription: ProviderSubscription;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
