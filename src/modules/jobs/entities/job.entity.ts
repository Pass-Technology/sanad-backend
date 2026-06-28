import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { ClientAddressEntity } from '../../client/entity/client-address.entity';
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

    @Column({ type: 'boolean', default: false })
    isUrgent: boolean;

    @Column({ nullable: true })
    category: string;

    @Column({ nullable: true })
    location: string;

    @Column({ type: 'text', nullable: true })
    serviceAddress: string;

    @Column({ type: 'timestamp', nullable: true })
    requestedScheduledAt: Date | null;

    @Column({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.OPEN,
    })
    status: JobStatus;

    @ManyToOne(() => ClientProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;

    @ManyToOne(() => ClientAddressEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'client_address_id' })
    clientAddress: ClientAddressEntity | null;

    @OneToMany(() => OfferEntity, (offer) => offer.job)
    offers: OfferEntity[];
}
