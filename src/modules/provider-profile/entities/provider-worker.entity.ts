import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from './provider-profile.entity';

export enum WorkerStatus {
    AVAILABLE = 'AVAILABLE',
    BUSY = 'BUSY',
    OFFLINE = 'OFFLINE',
}

@Entity('provider_workers')
export class ProviderWorkerEntity extends BaseEntity {
    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: WorkerStatus,
        default: WorkerStatus.AVAILABLE,
    })
    status: WorkerStatus;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => ProviderProfileEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;
}
