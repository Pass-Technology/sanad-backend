import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource, In } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ServiceEntity } from './entities/service.entity';

import { localize } from '../../shared/localization.util'
import { RequestServiceDto } from './Dto/request-service.dto';
import { RequestServiceEntity } from './entities/request-service.entity';
import { RequestServiceResponseDto } from './Dto/request-service-response.dto';
import { ProviderServiceEntity } from './entities/provider-service.entity';
import { GetMyServicesQueryDto } from './Dto/get-my-services-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
@Injectable()
export class ServiceManagementService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
        @InjectRepository(ServiceEntity)
        private readonly serviceRepo: Repository<ServiceEntity>,
        @InjectRepository(RequestServiceEntity)
        private readonly requestServiceRepo: Repository<RequestServiceEntity>,
        private readonly dataSource: DataSource,
    ) { }

    // get all categories and their services in profile setup page
    async findAllCategories(lang: string = 'en', searchString?: string) {
        const categories = await this.categoryRepo.find({
            where: searchString ? [
                { isActive: true, services: { nameEn: ILike(`%${searchString}%`) } },
                { isActive: true, services: { nameAr: ILike(`%${searchString}%`) } }
            ] : { isActive: true },
            relations: { services: true },
            order: {
                name: 'ASC',
                services: {
                    sortOrder: 'ASC'
                }
            }
        });

        // return categories.map(category => this.localize(category, lang));
        return localize(categories, lang)
    }


    async getServicesByCategory(categoryId: string, lang: string = 'en') {
        const services = await this.serviceRepo.find({
            where: { category: { id: categoryId }, isActive: true },
            relations: { children: true },
            order: { sortOrder: 'ASC' }
        });

        return services.map(service => this.localize(service, lang));
    }

    async findServiceById(serviceId: string, lang: string = 'en') {
        const service = await this.serviceRepo.findOne({
            where: { id: serviceId, isActive: true },
            relations: { children: true }
        });

        return this.localize(service, lang);
    }

    async findServicesByIds(serviceIds: string[]) {
        if (!serviceIds || serviceIds.length === 0) return [];
        return await this.serviceRepo.find({
            where: { id: In(serviceIds), isActive: true }
        });
    }

    // get all services of provider insdie profile page (search and pagination)
    async getMyServices(userId: string, query: GetMyServicesQueryDto, lang: string = 'en'): Promise<PaginatedResponseDto<any>> {
        const { page = 1, limit = 10, searchString } = query;
        const skip = (page - 1) * limit;

        const whereCondition: any = {
            profile: { user: { id: userId } }
        };

        if (searchString) {
            whereCondition.service = [
                { nameEn: ILike(`%${searchString}%`) },
                { nameAr: ILike(`%${searchString}%`) }
            ];
        }

        const [items, totalItems] = await this.dataSource.manager.findAndCount(ProviderServiceEntity, {
            where: whereCondition,
            relations: {
                service: { category: true },
                pricingDetails: true
            },
            order: {
                service: { sortOrder: 'ASC' }
            },
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(totalItems / limit);

        const groupedMap = new Map<string, any>();

        for (const item of items) {
            const category = item.service?.category;
            if (!category) continue;

            if (!groupedMap.has(category.id)) {
                groupedMap.set(category.id, {
                    category: {
                        id: category.id,
                        name: category.name,
                        nameAr: category.nameAr,
                        icon: category.icon
                    },
                    services: []
                });
            }

            const { category: _cat, ...serviceWithoutCat } = item.service;
            groupedMap.get(category.id).services.push({
                ...item,
                service: serviceWithoutCat
            });
        }

        const groupedData = Array.from(groupedMap.values());

        return {
            data: localize(groupedData, lang),
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page
            }
        };
    }

    // request service endpoints

    async requestService(requestServiceDto: RequestServiceDto, userId: string) {
        let category: CategoryEntity | null = null;

        if (requestServiceDto.categoryId) {
            category = await this.categoryRepo.findOneBy({ id: requestServiceDto.categoryId });
            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }

        const requestService = this.requestServiceRepo.create({
            name: requestServiceDto.name,
            ...(category && { category }),
            user: { id: userId }
        });
        return this.requestServiceRepo.save(requestService);
    }

    async getRequestedServices(userId: string): Promise<RequestServiceResponseDto[]> {
        const response = await this.requestServiceRepo.find({
            where: { user: { id: userId } }
        });

        return response.map((e) => {
            return {
                id: e.id,
                name: e.name,
            } as RequestServiceResponseDto
        })
    }


    private localize(entity: any, lang: string) {
        if (!entity) return null;

        const { name, nameAr, services, children, ...rest } = entity;
        const localized: any = {
            ...rest,
            name: lang === 'ar' ? nameAr : name
        };

        if (services) {
            localized.services = services.map(s => this.localize(s, lang));
        }

        if (children) {
            localized.children = children.map(c => this.localize(c, lang));
        }

        return localized;
    }


}


