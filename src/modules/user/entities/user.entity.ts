import { Entity, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserIdentifierType } from '../enums/user-identifier-type.enum';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { OtpEntity } from '../../otp/entities/otp.entity';
import { SubscriptionEntity } from '../../../subscription/entities/subscription.entity';
import { RequestServiceEntity } from '../../../modules/service-management/entities/request-service.entity';
import { UserType } from '../enums/user-type.enum';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { WorkerProfileEntity } from '../../worker/entity/worker-profile.entity';
import { BlogEntity } from '../../blogs/entities/blog.entity';



@Entity('users')
export class UserEntity extends BaseEntity {

    @Column({ unique: true })
    identifier: string;

    @Column({
        type: 'enum',
        enum: UserIdentifierType,
    })
    identifierType: UserIdentifierType;


    @Column({ default: false })
    isVerified: boolean;

    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.PROVIDER
    })
    type: UserType;

    @Exclude()
    @Column({ select: false })
    password: string;

    @Exclude()
    @Column({ type: 'varchar', nullable: true, select: false })
    refreshToken: string | null;

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.user, {
        nullable: true,
    })
    providerProfile: ProviderProfileEntity;

    @OneToOne(() => ClientProfileEntity, (profile) => profile.user, {
        nullable: true,
    })
    clientProfile: ClientProfileEntity;

    @OneToOne(() => WorkerProfileEntity, (profile) => profile.user, {
        nullable: true,
    })
    workerProfile: WorkerProfileEntity;

    @Column({ default: false })
    isProfileCompleted: boolean;

    @OneToMany(() => OtpEntity, (otp) => otp.user)
    otps: OtpEntity[];

    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.user)
    subscriptions: SubscriptionEntity[];

    @OneToMany(() => RequestServiceEntity, (requestService) => requestService.user)
    requestServices: RequestServiceEntity[];

    @OneToMany(() => BlogEntity, (blog) => blog.author)
    blogs: BlogEntity[];
}

