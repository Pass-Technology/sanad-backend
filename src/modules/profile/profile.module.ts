import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';


import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ServiceManagementModule } from '../service-management/service-management.module';
import { PaymentModule } from '../payment/payment.module';


import { UserModule } from '../user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { LookUpProfileStatusEntity } from './lookup-tables/entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from './lookup-tables/entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from './lookup-tables/entities/lookup-company-type.entity';
import { LookupLanguagesEntity } from './lookup-tables/entities/lookup-languages.entity';
// import { LookUpBillingCycleEntity } from './lookup-tables/entities/lookup-biling-cycle.entity';
import { LookUpController } from './lookup-tables/lookup.controller';
import { LookUpService } from './lookup-tables/lookup.service';
import { LookupCacheService } from './lookup-tables/lookup-cache.service';

@Module({
    imports: [CacheModule.register(),
    TypeOrmModule.forFeature([
        ProviderProfileEntity,
        ProviderUserInfoEntity,
        BranchEntity,
        ServingAreaEntity,
        ProviderComplianceEntity,
        LookUpProfileStatusEntity,
        LookUpProviderTypeEntity,
        LookUpCompanyTypeEntity,
        LookupLanguagesEntity,
    ]),
        PaymentModule,
        UserModule,
        ServiceManagementModule,
    ],
    controllers: [ProfileController, LookUpController],
    providers: [ProfileService, ProfileRepository, LookUpService, LookupCacheService],
    exports: [ProfileService, LookUpService],
})
export class ProfileModule { }
