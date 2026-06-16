import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { RequestServiceStatus } from '../enums/request-service-status.enum';

@Entity('request_services')
export class RequestServiceEntity extends BaseEntity {
    @Column({ type: 'jsonb', nullable: false, default: { en: 'Service name', ar: 'اسم الخدمة' } })
    name: { en: string; ar: string };

    @ManyToOne(() => CategoryEntity)
    @JoinColumn({ name: 'category_id' })
    category?: CategoryEntity;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'text', default: '' })
    description: string;

    @Column({
        type: 'enum',
        enum: RequestServiceStatus,
        default: RequestServiceStatus.PENDING,
        enumName: 'status',
    })
    status: RequestServiceStatus;

    @Column({ nullable: true })
    rejectionReason: string;
}
