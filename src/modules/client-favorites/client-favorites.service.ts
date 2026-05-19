import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientFavoriteServiceEntity } from './entities/client-favorite-service.entity';
import { ClientFavoriteProviderEntity } from './entities/client-favorite-provider.entity';
import { ServiceEntity } from '../service-management/entities/service.entity';
import { ProviderProfileEntity } from '../provider-profile/entities/provider-profile.entity';
import { JobEntity } from '../marketplace/entities/job.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { JobStatus } from '../marketplace/enums/job-status.enum';
import { ClientService } from '../client/client.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';

@Injectable()
export class ClientFavoritesService {
    constructor(
        @InjectRepository(ClientFavoriteServiceEntity)
        private readonly favoriteServiceRepository: Repository<ClientFavoriteServiceEntity>,
        @InjectRepository(ClientFavoriteProviderEntity)
        private readonly favoriteProviderRepository: Repository<ClientFavoriteProviderEntity>,
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,
        @InjectRepository(ProviderProfileEntity)
        private readonly providerRepository: Repository<ProviderProfileEntity>,
        @InjectRepository(JobEntity)
        private readonly jobRepository: Repository<JobEntity>,
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
        private readonly clientService: ClientService,
    ) { }

    private async getClientByUserId(userId: string) {
        return await this.clientService.getProfile(userId);
    }

    async getFavorites(userId: string): Promise<FavoritesResponseDto> {
        const client = await this.getClientByUserId(userId);

        const favoriteServices = await this.favoriteServiceRepository.find({
            where: { client: { id: client.id } },
            relations: { service: true },
        });

        const favoriteProviders = await this.favoriteProviderRepository.find({
            where: { client: { id: client.id } },
            relations: {
                provider: { userInfo: true },
            },
        });

        const favoriteServicesDtos = favoriteServices.map((fs) => ({
            serviceId: fs.service.id,
            nameEn: fs.service.nameEn,
            nameAr: fs.service.nameAr,
        }));

        const favoriteProvidersDtos = await Promise.all(
            favoriteProviders.map(async (fp) => {
                const provider = fp.provider;

                // 1. Get Completed Jobs count between client & provider
                const usedTimes = await this.jobRepository.count({
                    where: {
                        client: { id: client.id },
                        provider: { id: provider.id },
                        status: JobStatus.COMPLETED,
                    },
                });

                // 2. Get Average Rating
                const ratingResult = await this.reviewRepository
                    .createQueryBuilder('review')
                    .select('AVG(review.rating)', 'avgRating')
                    .where('review.provider_id = :providerId', { providerId: provider.id })
                    .getRawOne();

                const rawAvg = ratingResult?.avgRating ? parseFloat(ratingResult.avgRating) : 0.0;
                const rating = parseFloat(rawAvg.toFixed(1));

                const name = provider.tradeName || provider.userInfo?.fullName || '';

                return {
                    providerId: provider.id,
                    name,
                    rating,
                    usedTimes,
                };
            }),
        );

        return {
            favoriteServices: favoriteServicesDtos,
            favoriteProviders: favoriteProvidersDtos,
        };
    }

    async addFavoriteService(userId: string, serviceId: string): Promise<ClientFavoriteServiceEntity> {
        return this.addFavoriteItem(
            userId,
            serviceId,
            this.serviceRepository,
            this.favoriteServiceRepository,
            'service',
            'Service',
        );
    }

    async removeFavoriteService(userId: string, serviceId: string): Promise<void> {
        return this.removeFavoriteItem(
            userId,
            serviceId,
            this.favoriteServiceRepository,
            'service',
            'service',
        );
    }

    async addFavoriteProvider(userId: string, providerId: string): Promise<ClientFavoriteProviderEntity> {
        return this.addFavoriteItem(
            userId,
            providerId,
            this.providerRepository,
            this.favoriteProviderRepository,
            'provider',
            'Provider',
        );
    }

    async removeFavoriteProvider(userId: string, providerId: string): Promise<void> {
        return this.removeFavoriteItem(
            userId,
            providerId,
            this.favoriteProviderRepository,
            'provider',
            'provider',
        );
    }

    private async addFavoriteItem<T>(
        userId: string,
        itemId: string,
        itemRepo: Repository<any>,
        favRepo: Repository<any>,
        itemKey: 'service' | 'provider',
        itemName: string,
    ): Promise<T> {
        const client = await this.getClientByUserId(userId);
        
        const exists = await itemRepo.exists({ where: { id: itemId } });
        if (!exists) {
            throw new NotFoundException(`${itemName} not found`);
        }

        let fav = await favRepo.findOne({
            where: { client: { id: client.id }, [itemKey]: { id: itemId } },
        });

        if (!fav) {
            fav = favRepo.create({ client, [itemKey]: { id: itemId } });
            await favRepo.save(fav);
        }

        return fav;
    }

    private async removeFavoriteItem(
        userId: string,
        itemId: string,
        favRepo: Repository<any>,
        itemKey: 'service' | 'provider',
        itemName: string,
    ): Promise<void> {
        const client = await this.getClientByUserId(userId);
        const fav = await favRepo.findOne({
            where: { client: { id: client.id }, [itemKey]: { id: itemId } },
        });

        if (!fav) {
            throw new NotFoundException(`Favorite ${itemName.toLowerCase()} not found`);
        }

        await favRepo.remove(fav);
    }
}
