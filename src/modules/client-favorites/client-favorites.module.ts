import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientFavoriteServiceEntity } from './entities/client-favorite-service.entity';
import { ClientFavoriteProviderEntity } from './entities/client-favorite-provider.entity';
import { ServiceEntity } from '../service-management/entities/service.entity';
import { ProviderProfileEntity } from '../provider-profile/entities/provider-profile.entity';
import { JobEntity } from '../marketplace/entities/job.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../client/client.module';
import { ClientFavoritesController } from './client-favorites.controller';
import { ClientFavoritesService } from './client-favorites.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClientFavoriteServiceEntity,
            ClientFavoriteProviderEntity,
            ServiceEntity,
            ProviderProfileEntity,
            JobEntity,
            ReviewEntity,
        ]),
        AuthModule,
        ClientModule,
    ],
    controllers: [ClientFavoritesController],
    providers: [ClientFavoritesService],
    exports: [ClientFavoritesService],
})
export class ClientFavoritesModule { }
