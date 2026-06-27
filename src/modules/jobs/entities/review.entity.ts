import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { JobEntity } from './job.entity';

@Entity('reviews')
export class ReviewEntity extends BaseEntity {
    @Column({ type: 'int' })
    rating: number; // 1 to 5

    @Column({ type: 'text', nullable: true })
    comment: string;

    @ManyToOne(() => JobEntity, (job) => job.reviews, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'job_id' })
    job: JobEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'reviewer_id' })
    reviewer: UserEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'reviewee_id' })
    reviewee: UserEntity;
}
