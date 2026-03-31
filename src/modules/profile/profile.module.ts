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
import { ProviderPaymentEntity } from './entities/provider-payment.entity';
import { PaymentCashEntity } from './entities/payment-methods/payment-cash.entity';
import { PaymentBankTransferEntity } from './entities/payment-methods/payment-bank-transfer.entity';
import { PaymentLinkEntity } from './entities/payment-methods/payment-link.entity';
import { PaymentSanadEntity } from './entities/payment-methods/payment-sanad.entity';
import { PaymentPosEntity } from './entities/payment-methods/payment-pos.entity';
import { PaymentChequeEntity } from './entities/payment-methods/payment-cheque.entity';
import { ServiceManagementModule } from '../service-management/service-management.module';


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
        ProviderPaymentEntity,
        PaymentCashEntity,
        PaymentBankTransferEntity,
        PaymentLinkEntity,
        PaymentSanadEntity,
        PaymentPosEntity,
        PaymentChequeEntity,
        LookUpProfileStatusEntity,
        LookUpProviderTypeEntity,
        LookUpCompanyTypeEntity,
        LookupLanguagesEntity,
    ]),
        UserModule,
        ServiceManagementModule,
    ],
    controllers: [ProfileController, LookUpController],
    providers: [ProfileService, ProfileRepository, LookUpService, LookupCacheService],
    exports: [ProfileService, LookUpService],
})
export class ProfileModule { }
