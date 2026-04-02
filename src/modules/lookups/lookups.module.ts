import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

import { LookUpProfileStatusEntity } from './entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from './entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from './entities/lookup-company-type.entity';
import { LookupLanguagesEntity } from './entities/lookup-languages.entity';

import { LookUpController } from './lookup.controller';
import { LookUpService } from './lookup.service';
import { LookupCacheService } from './lookup-cache.service';

@Module({
    imports: [
        CacheModule.register(),
        TypeOrmModule.forFeature([
            LookUpProfileStatusEntity,
            LookUpProviderTypeEntity,
            LookUpCompanyTypeEntity,
            LookupLanguagesEntity,
        ]),
        UserModule,
    ],
    controllers: [LookUpController],
    providers: [LookUpService, LookupCacheService],
    exports: [LookUpService],
})
export class LookupsModule { }
