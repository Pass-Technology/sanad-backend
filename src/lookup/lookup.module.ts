import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookUpBillingCycle } from "./entities/lookup-biling-cycle.entity";
import { LookUpCompanyType } from "./entities/lookup-company-type.entity";
import { LookUpProfileStatus } from "./entities/lookup-profile-status.entity";
import { LookUpProviderType } from "./entities/lookup-provider-type.entity";
import { LookUpService } from "./lookup.service";
import { LookUpController } from "./lookup.controller";
import { LookupCacheService } from "./lookup-cache.service";
import { CacheModule } from "@nestjs/cache-manager";


@Module({
    providers: [LookUpService, LookupCacheService],
    controllers: [LookUpController],
    imports: [CacheModule.register(), TypeOrmModule.forFeature(
        [LookUpBillingCycle,
            LookUpCompanyType,
            LookUpProfileStatus,
            LookUpProviderType]),],
    exports: [LookUpService]
})
export class LookUpModule { }