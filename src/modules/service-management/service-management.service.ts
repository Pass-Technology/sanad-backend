import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ServiceEntity } from './entities/service.entity';

import { localize } from '../../shared/localization.util'
import { RequestServiceDto } from './Dto/request-service.dto';
import { RequestServiceEntity } from './entities/request-service.entity';
import { RequestServiceResponseDto } from './Dto/request-service-response.dto';
@Injectable()
export class ServiceManagementService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
        @InjectRepository(ServiceEntity)
        private readonly serviceRepo: Repository<ServiceEntity>,
        @InjectRepository(RequestServiceEntity)
        private readonly requestServiceRepo: Repository<RequestServiceEntity>,
    ) { }

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

    // request service endpoints

    async requestService(requestServiceDto: RequestServiceDto, userId: string) {
        const requestService = this.requestServiceRepo.create({
            ...requestServiceDto,
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
                name: e.nameAr ? e.nameAr : e.nameEn,
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


