import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';

export enum DocumentStatus {
    APPROVED = 'APPROVED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    EXPIRED = 'EXPIRED',
    MISSING = 'MISSING'
}

export enum DocumentRequiredFor {
    PROFILE = 'Provider Profile',
    SERVICE_ACTIVATION = 'Service Activation',
    COMPLIANCE = 'Compliance',
    FINANCE = 'Finance'
}

@Entity('provider_documents')
export class ProviderDocumentEntity extends BaseEntity {
    @ManyToOne(() => ProviderProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;

    @Column()
    type: string; // e.g., 'ID Card', 'Professional License'

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ type: 'timestamp', nullable: true })
    expiryDate: Date | null;

    @Column({
        type: 'enum',
        enum: DocumentStatus,
        default: DocumentStatus.MISSING
    })
    status: DocumentStatus;

    @Column({
        type: 'enum',
        enum: DocumentRequiredFor,
        default: DocumentRequiredFor.COMPLIANCE
    })
    requiredFor: DocumentRequiredFor;
}
