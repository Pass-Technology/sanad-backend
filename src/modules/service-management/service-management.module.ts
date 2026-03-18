import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ServiceEntity } from './entities/service.entity';
import { ServiceManagementController } from './service-management.controller';
import { ServiceManagementService } from './service-management.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity, ServiceEntity])
    ],
    controllers: [ServiceManagementController],
    providers: [ServiceManagementService],
    exports: [ServiceManagementService, TypeOrmModule],
})
export class ServiceManagementModule { }
