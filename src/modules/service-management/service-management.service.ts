import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ServiceEntity } from './entities/service.entity';

@Injectable()
export class ServiceManagementService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
        @InjectRepository(ServiceEntity)
        private readonly serviceRepo: Repository<ServiceEntity>,
    ) { }

    async findAllCategories() {
        return await this.categoryRepo.find({
            where: { isActive: true },
            relations: { services: true },
            order: {
                name: 'ASC',
                services: {
                    sortOrder: 'ASC'
                }
            }
        });
    }

    async getServicesByCategory(categoryId: string) {
        return await this.serviceRepo.find({
            where: { category: { id: categoryId }, isActive: true },
            relations: { children: true },
            order: { sortOrder: 'ASC' }
        });
    }
}
