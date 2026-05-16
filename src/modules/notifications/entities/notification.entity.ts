import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { NotificationType } from '../enums/notification-type.enum';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column()
    title: string;

    @Column({ type: 'text' })
    body: string;

    @Column({
        type: 'enum',
        enum: NotificationType
    })
    type: NotificationType;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @Column({ default: false })
    isRead: boolean;
}
