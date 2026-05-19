import { Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { ServiceEntity } from '../../service-management/entities/service.entity';

@Entity('client_favorite_services')
@Unique(['client', 'service'])
export class ClientFavoriteServiceEntity extends BaseEntity {
    @ManyToOne(() => ClientProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;

    @ManyToOne(() => ServiceEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: ServiceEntity;
}
