import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ServiceEntity } from './entities/service.entity';
import { ServiceManagementController } from './service-management.controller';
import { ServiceManagementService } from './service-management.service';
import { ProviderProfileEntity } from '../profile/entities/provider-profile.entity';
import { RequestServiceEntity } from './entities/request-service.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity, ServiceEntity, ProviderProfileEntity, RequestServiceEntity]),
        UserModule
    ],
    controllers: [ServiceManagementController],
    providers: [ServiceManagementService],
    exports: [ServiceManagementService],
})
export class ServiceManagementModule { }
