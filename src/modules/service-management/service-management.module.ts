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
import { ContractEntity } from '../jobs/entities/contract.entity';
import { PayoutEntity } from '../earnings/entities/payout.entity';
import { ProviderServiceController } from './provider-service.controller';
import { RequestServiceController } from './request-service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      ServiceEntity,
      ProviderProfileEntity,
      RequestServiceEntity,
      ProviderServiceEntity,
      ProviderServicePricingEntity,
      ContractEntity,
      PayoutEntity,
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [
    ServiceManagementController,
    ProviderServiceController,
    RequestServiceController,
  ],
  providers: [ServiceManagementService],
  exports: [ServiceManagementService],
})
export class ServiceManagementModule {}
