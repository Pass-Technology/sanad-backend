import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource, In } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ServiceEntity } from './entities/service.entity';
import { localize } from '../../shared/localization.util';
import { RequestServiceDto } from './Dto/request-service.dto';
import { RequestServiceEntity } from './entities/request-service.entity';
import { ProviderServiceEntity } from './entities/provider-service.entity';
import { GetMyServicesQueryDto } from './Dto/get-my-services-query.dto';
import { GetProviderCategoryServicesQueryDto } from './Dto/get-provider-category-services.dto';
import { AvailabilityDto } from '../provider-profile/dto/availability.dto';
import { JobEntity } from '../marketplace/entities/job.entity';
import { RequestServiceStatus } from './enums/request-service-status.enum';
import { PayoutEntity } from '../earnings/entities/payout.entity';
import { PayoutStatus } from '../earnings/enums/payout-status.enum';
import { JobStatus } from '../marketplace/enums/job-status.enum';

@Injectable()
export class ServiceManagementService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
        @InjectRepository(ServiceEntity)
        private readonly serviceRepo: Repository<ServiceEntity>,
        @InjectRepository(RequestServiceEntity)
        private readonly requestServiceRepo: Repository<RequestServiceEntity>,
        @InjectRepository(ProviderServiceEntity)
        private readonly providerServiceRepo: Repository<ProviderServiceEntity>,
        private readonly dataSource: DataSource,
        @InjectRepository(JobEntity)
        private readonly jobRepo: Repository<JobEntity>,
        @InjectRepository(PayoutEntity)
        private readonly earningRepo: Repository<PayoutEntity>,
    ) {}

    // get all categories and their services in profile setup page
    async findAllCategories(lang: string = 'en', searchString?: string) {
        const categories = await this.categoryRepo.find({
            where: searchString
                ? [
                      { isActive: true, services: { nameEn: ILike(`%${searchString}%`) } },
                      { isActive: true, services: { nameAr: ILike(`%${searchString}%`) } },
                  ]
                : { isActive: true },
            relations: { services: true },
            order: {
                name: 'ASC',
                services: {
                    sortOrder: 'ASC',
                },
            },
        });

        // return categories.map(category => this.localize(category, lang));
        return localize(categories, lang);
    }

    async findProviderCategories(lang: string = 'en', userId: string) {
        const [providerServices, totalServices, activeServices] = await Promise.all([
            this.providerServiceRepo.find({
                where: { profile: { user: { id: userId } } },
                relations: {
                    service: {
                        category: true,
                    },
                },
            }),
            this.providerServiceRepo.count({ where: { profile: { user: { id: userId } } } }),
            this.providerServiceRepo.count({ where: { profile: { user: { id: userId } }, isActive: true } }),
        ]);

        const categoryMap = new Map();

        for (const ps of providerServices) {
            const category = ps.service?.category;
            if (category && !categoryMap.has(category.id)) {
                // Strip any relations from the category object
                const { services, ...cleanCategory } = category;
                cleanCategory.description = cleanCategory.description ? cleanCategory.description[lang] : null;
                categoryMap.set(category.id, cleanCategory);
            }
        }

        const categories = Array.from(categoryMap.values());
        const localizedCategories = localize(categories, lang);
        return { categories: localizedCategories, totalServices, activeServices };
    }

    async findProviderCategoryServices(
        lang: string = 'en',
        userId: string,
        categoryId: string,
        dto: GetProviderCategoryServicesQueryDto,
    ) {
        const { name, status, page, limit } = dto;

        const query = this.providerServiceRepo
            .createQueryBuilder('providerService')
            .innerJoin('providerService.profile', 'profile')
            .innerJoin('profile.user', 'user')
            .leftJoinAndSelect('providerService.service', 'service')
            .innerJoin('service.category', 'category')
            .leftJoinAndSelect('providerService.pricingDetails', 'pricingDetails')
            .select([
                'providerService.id',
                'providerService.description',
                'providerService.isActive',
                'providerService.status',
                'providerService.availability',
                'pricingDetails.id',
                'pricingDetails.description',
                'pricingDetails.price',
                'service.nameAr',
                'service.nameEn',
            ])
            .where('user.id = :userId', { userId })
            .andWhere('category.id = :categoryId', { categoryId });

        if (name) {
            if (lang === 'ar') {
                query.andWhere('service.name_ar ILIKE :serviceName', { serviceName: `%${name}%` });
            } else {
                query.andWhere('service.name_en ILIKE :serviceName', { serviceName: `%${name}%` });
            }
        }
        if (status) {
            query.andWhere('providerService.status = :status', { status });
        }

        const results = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return results.map((ps) => ({
            id: ps.id,
            description: ps.description,
            isActive: ps.isActive,
            status: ps.status,
            availability: ps.availability,
            serviceId: ps.service.id,
            pricingDetails: ps.pricingDetails,
            minPrice: ps.minPrice,
            maxPrice: ps.maxPrice,
        }));
    }

    async getServicesByCategory(categoryId: string, lang: string = 'en') {
        const services = await this.serviceRepo.find({
            where: { category: { id: categoryId }, isActive: true },
            relations: { children: true },
            order: { sortOrder: 'ASC' },
        });

        return services.map((service) => this.localize(service, lang));
    }

    async getproviderService(serviceId: string, userId: string, lang: string = 'en') {
        const providerService = await this.providerServiceRepo.findOne({
            where: { profile: { user: { id: userId } }, id: serviceId },
            relations: { service: { category: true }, pricingDetails: true },
            order: { createdAt: 'DESC' },
        });

        if (!providerService) {
            throw new NotFoundException('Service was not found');
        }

        return {
            id: providerService?.id,
            description: providerService.description ? providerService.description[lang] : null,
            isActive: providerService.isActive,
            idEmrgencyEnabled: providerService.isEmergencyEnabled,
            serviceId: providerService.service.id,
            pricingDetails: providerService.pricingDetails,
            availability: providerService.availability,
            status: providerService.status,
            categoryId: providerService.service.category.id,
            minPrice: providerService.minPrice,
            maxPrice: providerService.maxPrice,
        };
    }

    async deleteProviderService(serviceId: string, userId: string, lang: string = 'en') {
        const providerService = await this.providerServiceRepo.findOne({
            where: { profile: { user: { id: userId } }, id: serviceId },
            relations: { service: { category: true }, pricingDetails: true },
            order: { createdAt: 'DESC' },
        });
        if (!providerService) {
            throw new NotFoundException('Could not find the provider service');
        }

        await this.providerServiceRepo.remove(providerService);

        return { success: true, message: 'Deleted successfully' };
    }

    async upsertAvailabilty(userId: string, dto: AvailabilityDto, serviceId: string) {
        await this.providerServiceRepo.upsert({ ...dto, id: serviceId }, ['id']);
        return await this.providerServiceRepo.find({
            select: { availability: true },
            where: { id: serviceId, profile: { user: { id: userId } } },
        });
    }

    async getAvailabilty(userId: string, serviceId: string) {
        return await this.providerServiceRepo.find({
            select: { availability: true },
            where: { id: serviceId, profile: { user: { id: userId } } },
        });
    }

    async getProviderServicesStats(userId: string) {
        const [totalCategoriesCount, totalActiveServicesCount, totalCustomersCount, totalEarnings] = await Promise.all([
            this.providerServiceRepo
                .createQueryBuilder('providerService')
                .innerJoin('providerService.profile', 'profile')
                .innerJoin('profile.user', 'user')
                .innerJoin('providerService.service', 'service')
                .innerJoin('service.category', 'category')
                .where('user.id = :userId', { userId })
                .select('COUNT(DISTINCT category.id)', 'totalCategories')
                .getRawOne(),
            this.providerServiceRepo.count({
                where: { profile: { user: { id: userId } }, isActive: true },
            }),
            this.jobRepo
                .createQueryBuilder('job')
                .leftJoin('job.provider', 'provider')
                .leftJoin('provider.user', 'user')
                .setParameters({ userId, status: JobStatus.COMPLETED })
                .getCount(),
            this.earningRepo
                .createQueryBuilder('earnings')
                .select('SUM(earnings.amount)', 'sum')
                .leftJoin('earnings.provider', 'provider')
                .leftJoin('provider.user', 'user')
                .where('user.id = :userId', { userId })
                .andWhere('earnings.status = :status', { status: PayoutStatus.PAID })
                .getRawOne(),
        ]);
        return {
            totalCategoriesCount: totalCategoriesCount.totalCategories,
            totalActiveServicesCount,
            totalCustomersCount,
            totalEarnings: totalEarnings ? parseFloat(totalEarnings.sum) : 0,
        };
    }

    async findServiceById(serviceId: string, lang: string = 'en') {
        const service = await this.serviceRepo.findOne({
            where: { id: serviceId, isActive: true },
            relations: { children: true },
        });

        return this.localize(service, lang);
    }

    async getServiceOrThrow(serviceId: string) {
        const service = await this.serviceRepo.findOne({
            where: { id: serviceId, isActive: true },
        });
        if (!service) {
            throw new NotFoundException('Service not found');
        }
        return service;
    }

    async findServicesByIds(serviceIds: string[]) {
        if (!serviceIds || serviceIds.length === 0) return [];
        return await this.serviceRepo.find({
            where: { id: In(serviceIds), isActive: true },
        });
    }

    // get all services of provider insdie profile page (search and pagination)
    async getMyServices(userId: string, query: GetMyServicesQueryDto, lang: string = 'en'): Promise<any> {
        const { page = 1, limit = 10, searchString, categoryId } = query;
        const skip = (page - 1) * limit;

        // Get all unique categories the provider has services in
        const allCategories = await this.categoryRepo
            .createQueryBuilder('category')
            .innerJoin('category.services', 'service')
            .innerJoin('service.providerServices', 'ps')
            .innerJoin('ps.profile', 'profile')
            .innerJoin('profile.user', 'user')
            .where('user.id = :userId', { userId })
            .select(['category.id', 'category.name', 'category.nameAr', 'category.icon'])
            .distinct(true)
            .getMany();

        const baseWhere: any = {
            profile: { user: { id: userId } },
        };

        let whereCondition: any;

        if (searchString) {
            const serviceBase = categoryId ? { category: { id: categoryId } } : {};
            whereCondition = [
                { ...baseWhere, service: { ...serviceBase, nameEn: ILike(`%${searchString}%`) } },
                { ...baseWhere, service: { ...serviceBase, nameAr: ILike(`%${searchString}%`) } },
            ];
        } else {
            whereCondition = baseWhere;
            if (categoryId) {
                whereCondition.service = { category: { id: categoryId } };
            }
        }

        const [items, totalItems] = await this.dataSource.manager.findAndCount(ProviderServiceEntity, {
            where: whereCondition,
            relations: {
                service: { category: true },
                pricingDetails: true,
            },
            order: {
                service: { sortOrder: 'ASC' },
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
                        icon: category.icon,
                    },
                    services: [],
                });
            }

            const { category: _cat, ...serviceWithoutCat } = item.service;
            groupedMap.get(category.id).services.push({
                ...item,
                service: serviceWithoutCat,
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
                currentPage: page,
            },
            providerCategories: localize(allCategories, lang),
        };
    }

    // toggle activation status for a provider's service
    async serviceToggleStatus(providerServiceId: string, userId: string) {
        const providerService = await this.providerServiceRepo.findOneBy({
            id: providerServiceId,
            profile: { user: { id: userId } },
        });
        if (!providerService) {
            throw new NotFoundException('Provider service not found');
        }
        providerService.isActive = !providerService.isActive;
        return await this.providerServiceRepo.save(providerService);
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
            user: { id: userId },
            description: requestServiceDto.description,
        });
        return this.requestServiceRepo.save(requestService);
    }

    async editRequestService(requestServiceDto: RequestServiceDto, userId: string, requestServiceId: string) {
        const requestService = await this.requestServiceRepo.findOneOrFail({
            where: { id: requestServiceId, user: { id: userId } },
        });
        if (requestService.status !== RequestServiceStatus.PENDING) {
            throw new Error('Editing requested service is disabled');
        }
        requestService.description = requestServiceDto.description;
        requestService.name = requestServiceDto.name;
        await this.requestServiceRepo.save(requestService);

        return { message: 'Updated successfully' };
    }

    async getRequestedServices(userId: string) {
        const response = await this.requestServiceRepo.find({
            where: { user: { id: userId } },
        });
        return response.map((e) => {
            return {
                id: e.id,
                name: e.name,
                description: e.description,
            };
        });
    }

    async getRequestedService(userId: string, serviceId: string) {
        return await this.requestServiceRepo.findOne({
            where: {
                id: serviceId,
                user: { id: userId },
            },
        });
    }

    private localize(entity: any, lang: string) {
        if (!entity) return null;

        const { name, nameAr, services, children, ...rest } = entity;
        const localized: any = {
            ...rest,
            name: lang === 'ar' ? nameAr : name,
        };

        if (services) {
            localized.services = services.map((s) => this.localize(s, lang));
        }

        if (children) {
            localized.children = children.map((c) => this.localize(c, lang));
        }

        return localized;
    }
}
