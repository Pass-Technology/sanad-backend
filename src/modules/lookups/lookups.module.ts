import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LookUpProfileStatusEntity } from './entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from './entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from './entities/lookup-company-type.entity';
import { LookupLanguagesEntity } from './entities/lookup-languages.entity';
import { LookUpPaymentEntity } from './entities/lookup-payment.entity';
import { LookUpPaymentCategoryEntity } from './entities/lookup-payment-category.entity';

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
        ]),
    ],
    controllers: [LookUpController],
    providers: [LookUpService],
    exports: [LookUpService],
})
export class LookupsModule { }
