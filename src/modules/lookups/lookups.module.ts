import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

import { LookUpProfileStatusEntity } from './entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from './entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from './entities/lookup-company-type.entity';
import { LookupLanguagesEntity } from './entities/lookup-languages.entity';
import { LookUpPaymentEntity } from './entities/lookup-payment.entity';
import { LookUpPaymentCategoryEntity } from './entities/lookup-payment-category.entity';
import { LookupNationalityEntity } from './entities/lookup-nationality.entity';
import { LookupCityEntity } from './entities/lookup-city.entity';
import { LookupUnitEntity } from './entities/lookup-unit.entity';
import { LookupCurrencyEntity } from './entities/lookup-currency.entity';


import { LookUpController } from './lookup.controller';
import { LookUpService } from './lookup.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            LookUpProfileStatusEntity,
            LookUpProviderTypeEntity,
            LookUpCompanyTypeEntity,
            LookupLanguagesEntity,
            LookUpPaymentEntity,
            LookUpPaymentCategoryEntity,
            LookupNationalityEntity,
            LookupCityEntity,
            LookupUnitEntity,
            LookupCurrencyEntity,
        ]),
        UserModule,
        AuthModule,
    ],
    controllers: [LookUpController],
    providers: [LookUpService],
    exports: [LookUpService],
})
export class LookupsModule { }
