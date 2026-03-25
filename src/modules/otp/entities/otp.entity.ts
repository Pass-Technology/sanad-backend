import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { OtpPurposeEnum } from '../enum/otp-purpose.enum';

@Entity('otps')
export class OtpEntity extends BaseEntity {
    @Column()
    otp: number;

    @Column({ default: false })
    isVerified: boolean;

    @Column()
    expiresAt: Date;

    @Column({ type: 'enum', enum: OtpPurposeEnum })
    purpose: OtpPurposeEnum;

    @ManyToOne(() => UserEntity, (user) => user.otps)
    user: UserEntity;


}
