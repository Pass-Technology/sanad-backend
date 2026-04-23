import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';

import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ProviderServiceEntity } from '../service-management/entities/provider-service.entity';
import { ProviderServicePricingEntity } from '../service-management/entities/provider-service-pricing.entity';
import { ServiceManagementModule } from '../service-management/service-management.module';

import { UserModule } from '../user/user.module';
import { LookupsModule } from '../lookups/lookups.module';
import { ProviderPaymentEntity } from '../payment/entities/provider-payment.entity';
import { PaymentModule } from '../payment/payment.module';
import { ScoringSystemModule } from '../profile-scoring-system/scoring-system.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProviderProfileEntity,
            ProviderUserInfoEntity,
            BranchEntity,
            ServingAreaEntity,
            ProviderComplianceEntity,
            ProviderPaymentEntity,
            ProviderServiceEntity,
            ProviderServicePricingEntity,
        ]),
        UserModule,
        ServiceManagementModule,
        LookupsModule,
        PaymentModule,
        forwardRef(() => ScoringSystemModule),
    ],
    controllers: [ProfileController],
    providers: [ProfileService, ProfileRepository],
    exports: [ProfileService, ProfileRepository],
})
export class ProfileModule { }
