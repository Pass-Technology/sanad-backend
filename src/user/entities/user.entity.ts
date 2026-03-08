import { Entity, Column, OneToOne } from 'typeorm';
import { UserIdentifierType } from '../enums/user-identifier-type.enum';
import { BaseEntity } from '../../shared/base-entity';
import { ProviderProfile } from '../../profile/entities/provider-profile.entity';


@Entity('users')
export class User extends BaseEntity {

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

    @OneToOne(() => ProviderProfile, (profile) => profile.user, {
        nullable: true,
        eager: false,
    })
    profile: ProviderProfile;

}
