import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { JobEntity } from './job.entity';
import { OfferEntity } from './offer.entity';
import { ContractStatus } from '../enums/contract-status.enum';
import { ReviewEntity } from './review.entity';

@Entity('contracts')
export class ContractEntity extends BaseEntity {
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({
        type: 'enum',
        enum: ContractStatus,
        default: ContractStatus.ACTIVE,
    })
    status: ContractStatus;

    @OneToOne(() => JobEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'job_id' })
    job: JobEntity;

    @OneToOne(() => OfferEntity, { onDelete: 'RESTRICT', nullable: false })
    @JoinColumn({ name: 'accepted_offer_id' })
    acceptedOffer: OfferEntity;

    @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: UserEntity;

    @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider: UserEntity;

    @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assigned_worker_id' })
    assignedWorker: UserEntity | null;

    @OneToMany(() => ReviewEntity, (review) => review.contract)
    reviews: ReviewEntity[];
}
