import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { UserIdentifierType } from '../enums/user-identifier-type.enum';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../profile/entities/provider-profile.entity';
import { OtpEntity } from '../../otp/entities/otp.entity';


@Entity('users')
export class UserEntity extends BaseEntity {

    @Column({ unique: true })
    identifier: string;

    @Column({
        type: 'enum',
        enum: UserIdentifierType,
    })
    identifierType: UserIdentifierType;

    @Column()
    password: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'varchar', nullable: true })
    refreshToken: string | null;

    @OneToOne(() => ProviderProfileEntity, (profile) => profile.user, {
        nullable: true,
        // eager: false,
    })
    profile: ProviderProfileEntity;

    @Column({ default: false })
    isProfileCompleted: boolean;

    @OneToMany(() => OtpEntity, (otp) => otp.user)
    otps: OtpEntity[];

}
