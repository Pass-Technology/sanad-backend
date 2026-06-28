import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ContractEntity } from './contract.entity';

@Entity('reviews')
export class ReviewEntity extends BaseEntity {
    @Column({ type: 'int' })
    rating: number; // 1 to 5

    @Column({ type: 'text', nullable: true })
    comment: string;

    @ManyToOne(() => ContractEntity, (contract) => contract.reviews, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'contract_id' })
    contract: ContractEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'reviewer_id' })
    reviewer: UserEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'reviewee_id' })
    reviewee: UserEntity;
}
