import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { OtpPurposeEnum } from '../enum/otp-purpose.enum';

@Entity('otps')
export class OtpEntity extends BaseEntity {

    @Column()
    identifier: string; // email or mobile

    @Column()
    otp: string;

    @Column({ default: false })
    isVerified: boolean;


    @Column({ type: 'enum', enum: OtpPurposeEnum })
    otpPurpose: OtpPurposeEnum;

    @Column()
    expiresAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.otps)
    user: UserEntity;


}
