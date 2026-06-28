import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { JobStatus } from '../enums/job-status.enum';
import { OfferEntity } from './offer.entity';

@Entity('jobs')
export class JobEntity extends BaseEntity {
    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    budget: number;

    @Column({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.OPEN,
    })
    status: JobStatus;

    @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: UserEntity;

    @OneToMany(() => OfferEntity, (offer) => offer.job)
    offers: OfferEntity[];
}
