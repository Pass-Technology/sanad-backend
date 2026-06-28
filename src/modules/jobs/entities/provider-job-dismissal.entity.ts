import { Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { JobEntity } from './job.entity';

@Entity('provider_job_dismissals')
@Unique(['provider', 'job'])
export class ProviderJobDismissalEntity extends BaseEntity {
    @ManyToOne(() => ProviderProfileEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @ManyToOne(() => JobEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'job_id' })
    job: JobEntity;
}
