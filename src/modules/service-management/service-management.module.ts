import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ServiceEntity } from './entities/service.entity';
import { ServiceManagementController } from './service-management.controller';
import { ServiceManagementService } from './service-management.service';
import { ProviderProfileEntity } from '../provider-profile/entities/provider-profile.entity';
import { AuthModule } from '../auth/auth.module';
import { RequestServiceEntity } from './entities/request-service.entity';
import { ProviderServiceEntity } from './entities/provider-service.entity';
import { ProviderServicePricingEntity } from './entities/provider-service-pricing.entity';
import { UserModule } from '../user/user.module';
import { JobEntity } from '../marketplace/entities/job.entity';
import { PayoutEntity } from '../earnings/entities/payout.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CategoryEntity,
            ServiceEntity,
            ProviderProfileEntity,
            RequestServiceEntity,
            ProviderServiceEntity,
            ProviderServicePricingEntity,
            JobEntity,
            PayoutEntity,
        ]),
        UserModule,
        AuthModule,
    ],
    controllers: [ServiceManagementController],
    providers: [ServiceManagementService],
    exports: [ServiceManagementService],
})
export class ServiceManagementModule {}
