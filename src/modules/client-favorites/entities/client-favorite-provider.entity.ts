import { Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ClientProfileEntity } from '../../client/entity/client-profile.entity';
import { ProviderProfileEntity } from '../../provider-profile/entities/provider-profile.entity';

@Entity('client_favorite_providers')
@Unique(['client', 'provider'])
export class ClientFavoriteProviderEntity extends BaseEntity {
    @ManyToOne(() => ClientProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: ClientProfileEntity;

    @ManyToOne(() => ProviderProfileEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider: ProviderProfileEntity;
}
