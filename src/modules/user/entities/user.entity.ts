import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserIdentifierType } from '../enums/user-identifier-type.enum';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../profile/entities/provider-profile.entity';
import { OtpEntity } from '../../otp/entities/otp.entity';
import { SubscriptionEntity } from '../../../subscription/entities/subscription.entity';



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

    @Exclude()
    @Column({ select: false })
    password: string;

    @Exclude()
    @Column({ type: 'varchar', nullable: true, select: false })
    refreshToken: string | null;

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.user, {
        nullable: true,
    })
    profile: ProviderProfileEntity;

    @Column({ default: false })
    isProfileCompleted: boolean;

    @OneToMany(() => OtpEntity, (otp) => otp.user)
    otps: OtpEntity[];

    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.user)
    subscriptions: SubscriptionEntity[];
}

