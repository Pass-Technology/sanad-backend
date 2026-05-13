import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { JobEntity } from '../../marketplace/entities/job.entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';

@Entity('reviews')
export class ReviewEntity extends BaseEntity {
    @OneToOne(() => JobEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' })
    job: JobEntity;

    @ManyToOne(() => ClientProfileEntity, { nullable: false })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;

    @ManyToOne(() => ProviderProfileEntity, (provider) => provider.reviews, { nullable: false })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @Column({ type: 'int' })
    rating: number; // 1-5

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ type: 'jsonb', nullable: true })
    tags: string[]; // e.g., ['Excellent', 'Fast']

    @Column({ type: 'jsonb', nullable: true })
    photos: string[];

    @Column({ type: 'text', nullable: true })
    providerReply: string;

    @Column({ type: 'timestamp', nullable: true })
    repliedAt: Date;

    @Column({ type: 'boolean', default: true })
    isVerified: boolean;
}
