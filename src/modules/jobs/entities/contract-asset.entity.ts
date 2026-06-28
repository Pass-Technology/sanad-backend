import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ContractEntity } from './contract.entity';
import { WorkerProfileEntity } from '../../worker/entity/worker-profile.entity';

@Entity('contract_assets')
export class ContractAssetEntity extends BaseEntity {
    @Column()
    imageUrl: string;

    @Column({ type: 'text', nullable: true })
    caption: string | null;

    @ManyToOne(() => ContractEntity, (contract) => contract.assets, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'contract_id' })
    contract: ContractEntity;

    @ManyToOne(() => WorkerProfileEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'uploaded_by_worker_id' })
    uploadedByWorker: WorkerProfileEntity | null;
}
