import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';
import { WorkerStatus } from '../enums/worker-status.enum';

@Entity('worker_profiles')
export class WorkerProfileEntity extends BaseEntity {
    @Column({ nullable: true })
    name: string;

    @Column({
        type: 'enum',
        enum: WorkerStatus,
        default: WorkerStatus.AVAILABLE,
    })
    status: WorkerStatus;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'boolean', default: false })
    isSelf: boolean;

    @OneToOne(() => UserEntity, (user) => user.workerProfile, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn()
    user: UserEntity | null;

    @ManyToOne(() => ProviderProfileEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'employer_provider_id' })
    employerProvider: ProviderProfileEntity | null;
}
