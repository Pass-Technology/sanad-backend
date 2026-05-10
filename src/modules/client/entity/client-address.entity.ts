import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from './client-profile.entity';

@Entity('client_addresses')
export class ClientAddressEntity extends BaseEntity {
    @Column()
    label: string; // e.g home/work/other

    @Column()
    address: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    lat: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    lng: number;

    @Column({ default: false })
    isDefault: boolean;

    @ManyToOne(() => ClientProfileEntity, (client) => client.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;
}
