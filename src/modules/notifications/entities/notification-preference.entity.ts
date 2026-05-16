import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('notification_preferences')
export class NotificationPreferenceEntity extends BaseEntity {
    @OneToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'jsonb', default: { push: true, inApp: true, email: true, whatsapp: false, sms: false } })
    channels: {
        push: boolean;
        inApp: boolean;
        email: boolean;
        whatsapp: boolean;
        sms: boolean;
    };

    @Column({ type: 'jsonb', default: { 
        jobs: true, 
        finance: true, 
        compliance: true, 
        performance: true, 
        system: true 
    } })
    categories: {
        jobs: boolean;
        finance: boolean;
        compliance: boolean;
        performance: boolean;
        system: boolean;
    };

    @Column({ type: 'jsonb', default: { 
        docExpiryDays: 15, 
        dailySummaryTime: '20:00', 
        weeklySummaryDay: 'Sunday' 
    } })
    reminderTiming: {
        docExpiryDays: number;
        dailySummaryTime: string;
        weeklySummaryDay: string;
    };

    @Column({ type: 'jsonb', default: { 
        isEnabled: false, 
        startTime: '22:00', 
        endTime: '07:00' 
    } })
    quietHours: {
        isEnabled: boolean;
        startTime: string;
        endTime: string;
    };
}
